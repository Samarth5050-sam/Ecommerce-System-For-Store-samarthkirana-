// Legacy wrapper — old callers pass a cart-based "order" object.
// New code should import from "@/lib/invoice" (snapshot-based).
import { InvoiceData, printInvoice } from "@/lib/invoice";
import { CartItem } from "@/types/store";
import { DEFAULT_GST_BY_CATEGORY } from "@/lib/billing";

interface LegacyOrder {
  id: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  status?: string;
}

/** Map the old order shape to a snapshot invoice and open the print view. */
export const generateInvoicePDF = (order: LegacyOrder) => {
  const invoice: InvoiceData = {
    invoice_no: `INV-${order.id.slice(-8).toUpperCase()}`,
    created_at: order.created_at,
    customer_name: order.customer_name ?? null,
    customer_phone: order.customer_phone ?? null,
    items: order.items.map((item, i) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      const gross = price * item.quantity;
      const rate = DEFAULT_GST_BY_CATEGORY[item.category] ?? 5;
      const taxable = gross / (1 + rate / 100);
      const gst = gross - taxable;
      return {
        line_no: i + 1,
        product_id: item.id,
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        unit_price: price,
        discount_pct: item.discount ?? 0,
        gst_rate: rate,
        tax_inclusive: true,
        gross_amount: Math.round(gross * 100) / 100,
        taxable_value: Math.round(taxable * 100) / 100,
        gst_amount: Math.round(gst * 100) / 100,
        cgst: Math.round((gst / 2) * 100) / 100,
        sgst: Math.round((gst / 2) * 100) / 100,
        line_total: Math.round(gross * 100) / 100,
      };
    }),
    item_count: order.items.length,
    quantity_total: order.items.reduce((s, i) => s + i.quantity, 0),
    subtotal: order.items.reduce((s, i) => {
      const price = i.discount ? i.price * (1 - i.discount / 100) : i.price;
      return s + price * i.quantity;
    }, 0),
    discount_total: order.items.reduce((s, i) => (i.discount ? s + i.price * i.quantity * (i.discount / 100) : s), 0),
    taxable_total: 0,
    cgst_total: 0,
    sgst_total: 0,
    gst_total: 0,
    rounding_adjustment: 0,
    grand_total: Math.round(order.total_amount),
    payment_method: "upi",
    amount_paid: Math.round(order.total_amount),
    balance_due: 0,
    payment_status: "paid",
    status: order.status,
  };
  invoice.items.forEach(l => {
    invoice.taxable_total += l.taxable_value;
    invoice.gst_total += l.gst_amount;
    invoice.cgst_total += l.cgst;
    invoice.sgst_total += l.sgst;
  });
  invoice.taxable_total = Math.round(invoice.taxable_total * 100) / 100;
  invoice.gst_total = Math.round(invoice.gst_total * 100) / 100;

  printInvoice(invoice, "80mm");
};
