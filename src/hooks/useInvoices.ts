import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BillLineInput, PaymentMethod } from "@/lib/billing";
import type { InvoiceData } from "@/lib/invoice";

export interface InvoiceRecord extends InvoiceData {
  id: string;
  user_id: string | null;
}

interface FinalizeOptions {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  invoiceType?: "retail" | "wholesale";
  isDemo?: boolean;
  notes?: string;
}

const mapRow = (row: Record<string, unknown>): InvoiceRecord => ({
  ...(row as unknown as InvoiceData),
  id: row.id as string,
  user_id: (row.user_id as string) ?? null,
  items: (row.items as unknown as InvoiceData["items"]) ?? [],
});

export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error && data) setInvoices(data.map(mapRow));
    setLoading(false);
  }, []);

  const getInvoice = useCallback(async (id: string): Promise<InvoiceRecord | null> => {
    const { data, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return mapRow(data);
  }, []);

  /**
   * Finalize a sale atomically on the server (stock validation + deduction +
   * invoice snapshot in one transaction). Safe against double-clicks and
   * network retries via the client reference id.
   */
  const finalizeSale = useCallback(
    async (lines: BillLineInput[], opts: FinalizeOptions): Promise<InvoiceRecord | null> => {
      if (!user) {
        toast.error("Please sign in to save the invoice");
        return null;
      }
      if (finalizing) return null; // guard duplicate submissions
      setFinalizing(true);
      const clientRef = crypto.randomUUID();
      try {
        const { data, error } = await supabase.rpc("finalize_sale", {
          p_payload: {
            client_ref: clientRef,
            user_id: user.id,
            customer_name: opts.customerName || null,
            customer_phone: opts.customerPhone || null,
            payment_method: opts.paymentMethod,
            amount_paid: opts.amountPaid,
            invoice_type: opts.invoiceType ?? "retail",
            is_demo: opts.isDemo ?? false,
            notes: opts.notes ?? null,
            lines: lines.map(l => ({
              product_id: l.product_id,
              name: l.name,
              unit: l.unit,
              quantity: l.quantity,
              unit_price: l.unit_price,
              discount_pct: l.discount_pct ?? 0,
              gst_rate: l.gst_rate,
              tax_inclusive: l.tax_inclusive ?? true,
              hsn_code: l.hsn_code ?? null,
            })),
          },
        });
        if (error) throw error;
        const result = data as { invoice_id: string; duplicate: boolean; invoice_no?: string };
        if (result?.duplicate) {
          toast.info("This invoice was already saved — reprinting the saved copy");
        } else {
          toast.success(`Invoice ${result?.invoice_no ?? ""} saved`);
        }
        const saved = await getInvoice(result.invoice_id);
        if (saved) setInvoices(prev => [saved, ...prev]);
        return saved;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(msg.replace(/^.*?(INSUFFICIENT_STOCK|INVALID_LINE|AUTH_REQUIRED|EMPTY_INVOICE): /, "").slice(0, 160) || "Could not save invoice");
        return null;
      } finally {
        setFinalizing(false);
      }
    },
    [user, finalizing, getInvoice]
  );

  /** Record a later payment against an unpaid/partial invoice (admin workflow). */
  const recordPayment = useCallback(async (invoice: InvoiceRecord, amount: number, method: PaymentMethod) => {
    const { error } = await supabase.from("payments").insert({
      invoice_id: invoice.id,
      amount,
      method,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast.error("Could not record payment");
      return false;
    }
    const newPaid = Math.min(invoice.grand_total, invoice.amount_paid + amount);
    const balance = Math.max(0, invoice.grand_total - newPaid);
    const status = balance <= 0 ? "paid" : "partial";
    const { error: updErr } = await supabase
      .from("invoices")
      .update({ amount_paid: newPaid, balance_due: balance, payment_status: status })
      .eq("id", invoice.id);
    if (updErr) {
      toast.error("Payment saved but invoice total not updated");
      return false;
    }
    toast.success("Payment recorded");
    await fetchInvoices();
    return true;
  }, [user, fetchInvoices]);

  return { invoices, loading, finalizing, fetchInvoices, getInvoice, finalizeSale, recordPayment };
};
