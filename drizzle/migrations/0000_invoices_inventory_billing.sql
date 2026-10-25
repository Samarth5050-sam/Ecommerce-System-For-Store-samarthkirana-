-- Additive, backward-compatible changes for professional billing

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS purchase_price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mrp numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gst_rate numeric NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS tax_inclusive boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hsn_code text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS base_unit text,
  ADD COLUMN IF NOT EXISTS units_per_package numeric NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS batch_number text,
  -- Decimal stock (kg/litre loose sales). Replaces integer stock_quantity.
  ADD COLUMN IF NOT EXISTS stock_qty numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.inventory.stock_quantity IS 'DEPRECATED: replaced by stock_qty (numeric) for decimal loose-weight stock';

-- Backfill decimal stock from the legacy integer column
UPDATE public.inventory SET stock_qty = stock_quantity WHERE stock_qty = 0 AND stock_quantity <> 0;

CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  client_ref uuid UNIQUE,
  user_id uuid,
  customer_name text,
  customer_phone text,
  invoice_type text NOT NULL DEFAULT 'retail',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  item_count integer NOT NULL DEFAULT 0,
  quantity_total numeric NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL DEFAULT 0,
  discount_total numeric NOT NULL DEFAULT 0,
  taxable_total numeric NOT NULL DEFAULT 0,
  cgst_total numeric NOT NULL DEFAULT 0,
  sgst_total numeric NOT NULL DEFAULT 0,
  gst_total numeric NOT NULL DEFAULT 0,
  rounding_adjustment numeric NOT NULL DEFAULT 0,
  grand_total numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  amount_paid numeric NOT NULL DEFAULT 0,
  balance_due numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'paid',
  status text NOT NULL DEFAULT 'completed',
  is_demo boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  method text NOT NULL DEFAULT 'cash',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES public.inventory(id) ON DELETE SET NULL,
  product_id text,
  movement_type text NOT NULL,
  quantity_delta numeric NOT NULL,
  balance_after numeric,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payments (invoice_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_inventory ON public.stock_movements (inventory_id);

GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.stock_movements TO service_role;
GRANT SELECT ON public.stock_movements TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.invoice_number_seq TO service_role;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own invoices" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update invoices" ON public.invoices
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view payments for their invoices" ON public.payments
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR EXISTS (
      SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can pay their own invoices" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR EXISTS (
      SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND (i.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Admins can view stock movements" ON public.stock_movements
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Atomic sale finalizer: validates stock, computes totals server-side (single
-- source of truth with src/lib/billing.ts), inserts the invoice, deducts
-- stock and records movements in one transaction. Demo invoices do not
-- touch stock or movement history.
CREATE OR REPLACE FUNCTION public.finalize_sale(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_ref uuid := NULLIF(p_payload->>'client_ref', '')::uuid;
  v_is_demo boolean := COALESCE((p_payload->>'is_demo')::boolean, false);
  v_user_id uuid := NULLIF(p_payload->>'user_id', '')::uuid;
  v_customer_name text := p_payload->>'customer_name';
  v_customer_phone text := p_payload->>'customer_phone';
  v_payment_method text := COALESCE(p_payload->>'payment_method', 'cash');
  v_amount_paid numeric := COALESCE((p_payload->>'amount_paid')::numeric, 0);
  v_invoice_type text := COALESCE(p_payload->>'invoice_type', 'retail');
  v_lines jsonb := COALESCE(p_payload->'lines', '[]'::jsonb);
  v_notes text := p_payload->>'notes';
  v_existing public.invoices;
  v_line jsonb;
  v_qty numeric; v_price numeric; v_disc numeric; v_rate numeric;
  v_tax_incl boolean; v_gross numeric; v_taxable numeric; v_gst numeric;
  v_line_total numeric;
  v_subtotal numeric := 0; v_discount_total numeric := 0; v_taxable_total numeric := 0;
  v_cgst_total numeric := 0; v_sgst_total numeric := 0; v_gst_total numeric := 0;
  v_pre_round numeric := 0;
  v_grand numeric; v_rounding numeric; v_balance numeric; v_status text;
  v_invoice_no text; v_invoice_id uuid;
  v_item_count integer; v_quantity_total numeric;
  v_stock numeric; v_inventory_id uuid; v_product_id text; v_name text; v_unit text;
  v_snapshot jsonb := '[]'::jsonb;
  v_line_no integer := 0;
BEGIN
  IF v_client_ref IS NOT NULL THEN
    SELECT * INTO v_existing FROM public.invoices WHERE client_ref = v_client_ref;
    IF FOUND THEN
      RETURN jsonb_build_object('duplicate', true, 'invoice_id', v_existing.id, 'invoice_no', v_existing.invoice_no);
    END IF;
  END IF;

  IF v_user_id IS NULL THEN
    v_user_id := auth.uid();
  END IF;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED: sign in to finalize a sale';
  END IF;

  IF jsonb_array_length(v_lines) = 0 THEN
    RAISE EXCEPTION 'EMPTY_INVOICE: at least one line is required';
  END IF;

  FOR v_line IN SELECT * FROM jsonb_array_elements(v_lines) LOOP
    v_line_no := v_line_no + 1;
    v_qty := (v_line->>'quantity')::numeric;
    v_price := COALESCE((v_line->>'unit_price')::numeric, 0);
    v_disc := COALESCE((v_line->>'discount_pct')::numeric, 0);
    v_rate := COALESCE((v_line->>'gst_rate')::numeric, 0);
    v_tax_incl := COALESCE((v_line->>'tax_inclusive')::boolean, true);
    v_name := COALESCE(v_line->>'name', 'Item');
    v_unit := COALESCE(v_line->>'unit', '');
    v_product_id := NULLIF(v_line->>'product_id', '');

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'INVALID_LINE: % quantity must be greater than 0', v_name;
    END IF;
    IF v_price < 0 THEN
      RAISE EXCEPTION 'INVALID_LINE: % price cannot be negative', v_name;
    END IF;

    v_gross := v_price * v_qty * (1 - v_disc / 100.0);
    IF v_rate = 0 THEN
      v_taxable := v_gross; v_gst := 0;
    ELSIF v_tax_incl THEN
      v_taxable := v_gross / (1 + v_rate / 100.0); v_gst := v_gross - v_taxable;
    ELSE
      v_taxable := v_gross; v_gst := v_gross * (v_rate / 100.0);
    END IF;
    v_line_total := round((v_taxable + v_gst)::numeric, 2);

    v_subtotal := v_subtotal + v_gross;
    v_discount_total := v_discount_total + v_price * v_qty * (v_disc / 100.0);
    v_taxable_total := v_taxable_total + v_taxable;
    v_gst_total := v_gst_total + v_gst;
    v_cgst_total := v_cgst_total + round((v_gst / 2)::numeric, 2);
    v_sgst_total := v_sgst_total + (round(v_gst::numeric, 2) - round((v_gst / 2)::numeric, 2));
    v_pre_round := v_pre_round + v_line_total;

    v_snapshot := v_snapshot || jsonb_build_object(
      'line_no', v_line_no,
      'product_id', v_product_id,
      'name', v_name,
      'unit', v_unit,
      'quantity', v_qty,
      'unit_price', v_price,
      'discount_pct', v_disc,
      'gst_rate', v_rate,
      'tax_inclusive', v_tax_incl,
      'hsn_code', v_line->'hsn_code',
      'gross_amount', round(v_gross::numeric, 2),
      'taxable_value', round(v_taxable::numeric, 2),
      'gst_amount', round(v_gst::numeric, 2),
      'cgst', round((v_gst / 2)::numeric, 2),
      'sgst', round(v_gst::numeric, 2) - round((v_gst / 2)::numeric, 2),
      'line_total', v_line_total
    );

    IF NOT v_is_demo AND v_product_id IS NOT NULL THEN
      SELECT id, stock_qty INTO v_inventory_id, v_stock
        FROM public.inventory WHERE product_id = v_product_id FOR UPDATE;
      IF FOUND THEN
        IF v_stock < v_qty THEN
          RAISE EXCEPTION 'INSUFFICIENT_STOCK: % has only % in stock', v_name, v_stock;
        END IF;
        UPDATE public.inventory
          SET stock_qty = stock_qty - v_qty,
              in_stock = (stock_qty - v_qty) > 0,
              updated_at = now()
          WHERE id = v_inventory_id;
        INSERT INTO public.stock_movements (inventory_id, product_id, movement_type, quantity_delta, balance_after, notes, created_by)
        VALUES (v_inventory_id, v_product_id, 'sale', -v_qty, v_stock - v_qty, 'Invoice sale', v_user_id);
      END IF;
    END IF;
  END LOOP;

  v_grand := round(v_pre_round::numeric, 0);
  v_rounding := round((v_grand - v_pre_round)::numeric, 2);
  IF v_amount_paid IS NULL OR v_amount_paid < 0 THEN v_amount_paid := 0; END IF;
  v_balance := GREATEST(0, v_grand - v_amount_paid);
  IF v_amount_paid <= 0 THEN v_status := 'unpaid';
  ELSIF v_balance > 0 THEN v_status := 'partial';
  ELSE v_status := 'paid'; END IF;

  v_item_count := jsonb_array_length(v_lines);
  SELECT COALESCE(SUM((l->>'quantity')::numeric), 0) INTO v_quantity_total
    FROM jsonb_array_elements(v_lines) l;

  v_invoice_no := 'INV-' || to_char(now(), 'YYMMDD') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');

  INSERT INTO public.invoices (
    invoice_no, client_ref, user_id, customer_name, customer_phone, invoice_type,
    items, item_count, quantity_total, subtotal, discount_total, taxable_total,
    cgst_total, sgst_total, gst_total, rounding_adjustment, grand_total,
    payment_method, amount_paid, balance_due, payment_status, is_demo, notes
  ) VALUES (
    v_invoice_no, v_client_ref, v_user_id, v_customer_name, v_customer_phone, v_invoice_type,
    v_snapshot, v_item_count, v_quantity_total, round(v_subtotal::numeric, 2), round(v_discount_total::numeric, 2), round(v_taxable_total::numeric, 2),
    round(v_cgst_total::numeric, 2), round(v_sgst_total::numeric, 2), round(v_gst_total::numeric, 2), v_rounding, v_grand,
    v_payment_method, v_amount_paid, v_balance, v_status, v_is_demo, v_notes
  ) RETURNING id INTO v_invoice_id;

  IF v_amount_paid > 0 THEN
    INSERT INTO public.payments (invoice_id, amount, method, created_by)
    VALUES (v_invoice_id, v_amount_paid, v_payment_method, v_user_id);
  END IF;

  RETURN jsonb_build_object('duplicate', false, 'invoice_id', v_invoice_id, 'invoice_no', v_invoice_no);
END;
$$;

GRANT EXECUTE ON FUNCTION public.finalize_sale(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_sale(jsonb) TO service_role;

COMMENT ON TABLE public.invoices IS 'Finalized sales invoices with GST snapshot. Reprinting must never re-run finalize_sale.';
