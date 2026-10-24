// Single source of truth for all billing, GST and invoice calculations.
// Used by the billing screen, saved invoices, PDF/thermal prints and reports
// so every surface shows identical numbers. Do NOT calculate tax elsewhere.

export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer" | "credit";
export type PaymentStatus = "paid" | "partial" | "unpaid";
export type InvoiceType = "retail" | "wholesale";

export interface BillLineInput {
  product_id: string | null;
  name: string;
  unit: string;
  quantity: number;
  /** Selling price per unit as typed. Interpretation depends on taxInclusive. */
  unit_price: number;
  /** Discount percent applied on the unit price (0–100). */
  discount_pct?: number;
  /** Effective GST rate for this product (percent). 0 = exempt/zero-rated. */
  gst_rate: number;
  /** true when unit_price already includes GST (typical kirana MRP pricing). */
  tax_inclusive?: boolean;
  hsn_code?: string | null;
}

export interface ComputedLine {
  product_id: string | null;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  discount_pct: number;
  hsn_code: string | null;
  /** Price after discount, before/including tax depending on taxInclusive. */
  gross_amount: number;
  taxable_value: number;
  gst_rate: number;
  tax_inclusive: boolean;
  gst_amount: number;
  cgst: number;
  sgst: number;
  line_total: number;
}

export interface InvoiceTotals {
  lines: ComputedLine[];
  item_count: number;
  quantity_total: number;
  subtotal: number;
  discount_total: number;
  taxable_total: number;
  cgst_total: number;
  sgst_total: number;
  gst_total: number;
  /** Rounding adjustment (positive = added) to reach the grand total. */
  rounding_adjustment: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  payment_status: PaymentStatus;
}

/**
 * Default GST rates per catalogue category.
 * Rates are editable per product (inventory.gst_rate). Defaults follow the
 * central GST rate schedules as a starting point; the shop can change any
 * product's rate from the admin panel.
 */
export const DEFAULT_GST_BY_CATEGORY: Record<string, number> = {
  grains: 5,
  pulses: 5,
  spices: 5,
  oils: 5,
  dairy: 5,
  snacks: 5,
  beverages: 5,
  personal: 18, // soaps, detergents, shampoos, toothpaste etc.
};

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/** Validate a line before billing. Returns human-readable error or null. */
export function validateLine(line: BillLineInput): string | null {
  if (!Number.isFinite(line.quantity) || line.quantity <= 0) return `${line.name}: quantity must be greater than 0`;
  if (!Number.isFinite(line.unit_price) || line.unit_price < 0) return `${line.name}: price cannot be negative`;
  if (!Number.isFinite(line.gst_rate) || line.gst_rate < 0 || line.gst_rate > 100) return `${line.name}: GST rate must be between 0 and 100`;
  const disc = line.discount_pct ?? 0;
  if (!Number.isFinite(disc) || disc < 0 || disc >= 100) return `${line.name}: discount must be between 0 and 99`;
  return null;
}

export function computeLine(line: BillLineInput): ComputedLine {
  const tax_inclusive = line.tax_inclusive ?? true;
  const discount_pct = line.discount_pct ?? 0;
  const discount_factor = 1 - discount_pct / 100;
  const gross = line.unit_price * line.quantity * discount_factor;

  let taxable: number;
  let gst: number;
  if (line.gst_rate === 0) {
    taxable = gross;
    gst = 0;
  } else if (tax_inclusive) {
    taxable = gross / (1 + line.gst_rate / 100);
    gst = gross - taxable;
  } else {
    taxable = gross;
    gst = gross * (line.gst_rate / 100);
  }

  return {
    product_id: line.product_id,
    name: line.name,
    unit: line.unit,
    quantity: line.quantity,
    unit_price: line.unit_price,
    discount_pct,
    hsn_code: line.hsn_code ?? null,
    gross_amount: round2(gross),
    taxable_value: round2(taxable),
    gst_rate: line.gst_rate,
    tax_inclusive,
    gst_amount: round2(gst),
    cgst: round2(gst / 2),
    sgst: round2(gst / 2),
    line_total: round2(tax_inclusive ? gross : gross + gst),
  };
}

/**
 * Compute full invoice totals from bill lines.
 * - Discounts are applied per line on the unit price.
 * - GST is split equally into CGST + SGST (intra-state sale, Maharashtra).
 * - Grand total is rounded to the nearest rupee; the difference is shown
 *   transparently as a rounding adjustment.
 */
export function computeInvoice(
  lines: BillLineInput[],
  options: { amountPaid?: number; skipValidation?: boolean } = {}
): InvoiceTotals {
  if (!options.skipValidation) {
    for (const l of lines) {
      const err = validateLine(l);
      if (err) throw new Error(err);
    }
  }

  const computed = lines.map(computeLine);
  const discount_total = computed.reduce(
    (s, l) => s + l.unit_price * l.quantity * (l.discount_pct / 100),
    0
  );
  const subtotal = computed.reduce((s, l) => s + l.gross_amount, 0);
  const taxable_total = computed.reduce((s, l) => s + l.taxable_value, 0);
  const gst_total = computed.reduce((s, l) => s + l.gst_amount, 0);
  const pre_round_total = subtotal + (lines.some(l => (l.tax_inclusive ?? true) === false) ? gst_total : 0);
  const grand_total = Math.round(pre_round_total);
  const rounding_adjustment = round2(grand_total - pre_round_total);

  const amountPaid = Math.max(0, round2(options.amountPaid ?? grand_total));
  const balance_due = round2(Math.max(0, grand_total - amountPaid));
  let payment_status: PaymentStatus = "paid";
  if (amountPaid <= 0) payment_status = "unpaid";
  else if (balance_due > 0) payment_status = "partial";

  return {
    lines: computed,
    item_count: computed.length,
    quantity_total: round2(computed.reduce((s, l) => s + l.quantity, 0)),
    subtotal: round2(subtotal),
    discount_total: round2(discount_total),
    taxable_total: round2(taxable_total),
    cgst_total: round2(computed.reduce((s, l) => s + l.cgst, 0)),
    sgst_total: round2(computed.reduce((s, l) => s + l.sgst, 0)),
    gst_total: round2(gst_total),
    rounding_adjustment,
    grand_total,
    amount_paid: amountPaid,
    balance_due,
    payment_status,
  };
}

/** Profit amount and margin (%) from recorded purchase cost and selling price. */
export function computeProfit(purchasePrice: number, sellingPrice: number, quantity = 1) {
  const profitAmount = (sellingPrice - purchasePrice) * quantity;
  const margin = sellingPrice > 0 ? (profitAmount / (sellingPrice * quantity)) * 100 : 0;
  return { profitAmount: round2(profitAmount), marginPct: round2(margin) };
}

/** Convert a package quantity (bags/cartons/boxes) into base units (kg/pieces). */
export function packageToBase(quantity: number, unitsPerPackage: number): number {
  if (unitsPerPackage <= 0) return quantity;
  return quantity * unitsPerPackage;
}
