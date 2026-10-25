// Professional invoice templates: 58 mm thermal, 80 mm thermal, A4 tax invoice.
// All numbers come from the saved invoice snapshot — never recompute here.
import { storeInfo } from "@/data/storeData";

export type PaperSize = "58mm" | "80mm" | "A4";

export interface InvoiceLine {
  line_no: number;
  product_id?: string | null;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  discount_pct: number;
  gst_rate: number;
  tax_inclusive: boolean;
  hsn_code?: string | null;
  gross_amount: number;
  taxable_value: number;
  gst_amount: number;
  cgst: number;
  sgst: number;
  line_total: number;
}

export interface InvoiceData {
  invoice_no: string;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  invoice_type?: string;
  cashier_name?: string | null;
  items: InvoiceLine[];
  item_count: number;
  quantity_total: number;
  subtotal: number;
  discount_total: number;
  taxable_total: number;
  cgst_total: number;
  sgst_total: number;
  gst_total: number;
  rounding_adjustment: number;
  grand_total: number;
  payment_method: string;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  status?: string;
  is_demo?: boolean;
  notes?: string | null;
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  bank_transfer: "Bank Transfer",
  credit: "Credit (Udhaar)",
};

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const qty = (n: number) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/** GST rate-wise summary, used on the A4 tax invoice. */
export function gstRateSummary(invoice: InvoiceData) {
  const byRate = new Map<number, { taxable: number; gst: number }>();
  for (const l of invoice.items) {
    const cur = byRate.get(l.gst_rate) ?? { taxable: 0, gst: 0 };
    cur.taxable += l.taxable_value;
    cur.gst += l.gst_amount;
    byRate.set(l.gst_rate, cur);
  }
  return [...byRate.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rate, v]) => ({ rate, taxable: Math.round(v.taxable * 100) / 100, gst: Math.round(v.gst * 100) / 100 }));
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

function headerBlock(compact: boolean) {
  return `
    <div class="hdr">
      <div class="shop">${esc(storeInfo.name)}</div>
      <div class="addr">${esc(storeInfo.fullAddress)}</div>
      <div class="addr">Ph: ${esc(storeInfo.contact)}</div>
      ${storeInfo.gstin ? `<div class="addr">GSTIN: ${esc(storeInfo.gstin)}</div>` : ""}
      ${storeInfo.fssai ? `<div class="addr">FSSAI: ${esc(storeInfo.fssai)}</div>` : ""}
      ${compact ? "" : `<div class="tag">${esc(storeInfo.tagline)}</div>`}
    </div>`;
}

function lineRows(invoice: InvoiceData, paper: PaperSize) {
  const showTaxCols = paper === "A4";
  return invoice.items
    .map(l => {
      if (paper === "58mm") {
        return `<tr>
          <td colspan="3" class="nm">${esc(l.name)}<span class="un"> ${esc(l.unit)}</span></td>
        </tr>
        <tr>
          <td class="qt">${qty(l.quantity)} × ${inr(l.unit_price)}</td>
          <td class="qt">${l.discount_pct ? `-${l.discount_pct}%` : ""}</td>
          <td class="am">${inr(l.line_total)}</td>
        </tr>`;
      }
      if (paper === "80mm") {
        return `<tr>
          <td class="nm">${esc(l.name)}<span class="un"> ${esc(l.unit)}</span></td>
          <td class="qt">${qty(l.quantity)}</td>
          <td class="am">${inr(l.line_total)}</td>
        </tr>`;
      }
      return `<tr>
        <td class="nm">${esc(l.name)}</td>
        ${l.hsn_code ? `<td class="ct">${esc(l.hsn_code)}</td>` : `<td class="ct">—</td>`}
        <td class="ct">${esc(l.unit)}</td>
        <td class="qt">${qty(l.quantity)}</td>
        <td class="am">${inr(l.unit_price)}</td>
        <td class="am">${l.discount_pct ? inr(l.gross_amount ? (l.unit_price * l.quantity * l.discount_pct) / 100 : 0) : "—"}</td>
        <td class="am">${inr(l.taxable_value)}</td>
        <td class="ct">${l.gst_rate}%</td>
        <td class="am">${inr(l.gst_amount)}</td>
        <td class="am">${inr(l.line_total)}</td>
      </tr>`;
    })
    .join("");
}

function totalsBlock(invoice: InvoiceData, paper: PaperSize) {
  const rows: Array<[string, string, boolean?]> = [
    ["Subtotal", inr(invoice.subtotal)],
  ];
  if (invoice.discount_total > 0) rows.push(["Total Discount", `- ${inr(invoice.discount_total)}`]);
  rows.push(["Taxable Value", inr(invoice.taxable_total)]);
  if (invoice.gst_total > 0) {
    rows.push([paper === "A4" ? "CGST" : "CGST (Central GST)", inr(invoice.cgst_total)]);
    rows.push([paper === "A4" ? "SGST" : "SGST (State GST)", inr(invoice.sgst_total)]);
  }
  if (invoice.rounding_adjustment !== 0) {
    rows.push(["Rounding", `${invoice.rounding_adjustment > 0 ? "+" : "-"} ${inr(Math.abs(invoice.rounding_adjustment))}`]);
  }
  const html = rows
    .map(([k, v]) => `<div class="tr"><span>${k}</span><span>${v}</span></div>`)
    .join("");
  return `
    <div class="totals">${html}
      <div class="tr grand"><span>GRAND TOTAL</span><span>${inr(invoice.grand_total)}</span></div>
    </div>`;
}

function footerBlock(invoice: InvoiceData) {
  const paid = invoice.payment_status === "paid";
  return `
    <div class="meta2">
      <div class="tr"><span>Payment Method</span><span>${esc(PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method)}</span></div>
      <div class="tr"><span>Amount Paid</span><span>${inr(invoice.amount_paid)}</span></div>
      ${invoice.balance_due > 0 ? `<div class="tr"><span>Balance Due</span><span>${inr(invoice.balance_due)}</span></div>` : ""}
    </div>
    <div class="items-total">${invoice.item_count} item(s) · ${qty(invoice.quantity_total)} quantity</div>
    ${invoice.is_demo ? `<div class="demo">DEMO — NOT A VALID TAX INVOICE</div>` : ""}
    ${invoice.status === "cancelled" ? `<div class="demo">CANCELLED</div>` : ""}
    <div class="thanks">Thank You for Shopping at Samarth Kirana!</div>
    <div class="inv-no">Invoice: ${esc(invoice.invoice_no)}</div>`;
}

export function buildInvoiceHTML(invoice: InvoiceData, paper: PaperSize): string {
  const date = new Date(invoice.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = new Date(invoice.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const isA4 = paper === "A4";
  const summary = isA4
    ? `<table class="gst-summary">
        <thead><tr><th>GST Rate</th><th>Taxable Value</th><th>GST Amount</th></tr></thead>
        <tbody>
          ${gstRateSummary(invoice).map(s => `<tr><td>${s.rate}%</td><td>${inr(s.taxable)}</td><td>${inr(s.gst)}</td></tr>`).join("")}
        </tbody>
      </table>`
    : "";

  const a4Head = isA4
    ? `<tr><th>Item</th><th>HSN/SAC</th><th>Unit</th><th>Qty</th><th>Rate</th><th>Disc</th><th>Taxable</th><th>GST</th><th>GST Amt</th><th>Amount</th></tr>`
    : paper === "80mm"
      ? `<tr><th class="nm">Item</th><th>Qty</th><th class="am">Amt</th></tr>`
      : "";

  const pageCss = isA4
    ? `@page { size: A4; margin: 12mm; } body { font-size: 12px; }`
    : paper === "80mm"
      ? `@page { size: 80mm auto; margin: 3mm; } body { font-size: 11px; }`
      : `@page { size: 58mm auto; margin: 2mm; } body { font-size: 10px; }`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(invoice.invoice_no)} — ${esc(storeInfo.name)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${isA4 ? "'Segoe UI', Arial, sans-serif" : "'Courier New', monospace"}; color: #111; background: #fff; padding: ${isA4 ? "0" : "2px"}; }
  .wrap { ${isA4 ? "max-width: 186mm; margin: auto;" : ""} }
  .hdr { text-align: center; border-bottom: 1px dashed #999; padding-bottom: 6px; margin-bottom: 6px; }
  .shop { font-weight: 700; ${isA4 ? "font-size: 20px;" : "font-size: 1.25em;"} }
  .addr { font-size: 0.92em; color: #333; }
  .tag { font-size: 0.85em; color: #666; }
  .bar { display: flex; justify-content: space-between; font-size: 0.9em; margin: 4px 0; }
  table.lines { width: 100%; border-collapse: collapse; }
  table.lines th { text-align: left; border-bottom: 1px solid #444; padding: 3px 2px; font-size: 0.85em; }
  table.lines td { padding: 3px 2px; border-bottom: 1px dotted #ccc; vertical-align: top; }
  td.nm, th.nm { max-width: ${isA4 ? "auto" : "42mm"}; }
  td.ct, th.ct { text-align: center; }
  td.qt, th.qt { text-align: center; white-space: nowrap; }
  td.am, th.am { text-align: right; white-space: nowrap; }
  .un { color: #777; font-size: 0.9em; }
  .totals { margin-top: 6px; border-top: 1px solid #444; padding-top: 4px; }
  .tr { display: flex; justify-content: space-between; padding: 1.5px 0; font-size: 0.95em; }
  .tr.grand { border-top: 1px solid #444; margin-top: 3px; padding-top: 4px; font-weight: 700; font-size: 1.2em; }
  .meta2 { margin-top: 6px; }
  .items-total { text-align: center; font-size: 0.85em; color: #555; margin-top: 4px; }
  .demo { text-align: center; border: 1px solid #b00; color: #b00; font-weight: 700; padding: 3px; margin-top: 6px; font-size: 0.95em; }
  .thanks { text-align: center; margin-top: 8px; font-weight: 600; }
  .inv-no { text-align: center; font-size: 0.8em; color: #666; margin-top: 2px; }
  table.gst-summary { width: 100%; border-collapse: collapse; margin-top: 10px; }
  table.gst-summary th, table.gst-summary td { border: 1px solid #999; padding: 4px 8px; text-align: right; }
  table.gst-summary th { background: #f3f3f3; text-align: center; font-size: 11px; }
  .actions { text-align: center; margin: 16px 0; }
  .actions button { padding: 8px 18px; margin: 0 4px; font-size: 13px; border-radius: 6px; border: 1px solid #888; cursor: pointer; }
  .btn-p { background: #e65100; color: #fff; border-color: #e65100; }
  @media print { .actions { display: none; } }
</style>
</head>
<body>
<div class="wrap">
  ${headerBlock(!isA4)}
  <div class="bar"><span>${date} · ${time}</span><span>${invoice.invoice_type === "wholesale" ? "WHOLESALE BILL" : "TAX INVOICE"}</span></div>
  <div class="bar"><span>Customer: ${esc(invoice.customer_name || "Walk-in Customer")}</span>${invoice.customer_phone ? `<span>${esc(invoice.customer_phone)}</span>` : ""}</div>
  ${invoice.cashier_name ? `<div class="bar"><span>Cashier: ${esc(invoice.cashier_name)}</span></div>` : ""}
  <table class="lines">
    <thead>${a4Head}</thead>
    <tbody>${lineRows(invoice, paper)}</tbody>
  </table>
  ${totalsBlock(invoice, paper)}
  ${summary}
  ${footerBlock(invoice)}
</div>
<div class="actions">
  <button class="btn-p" onclick="window.print()">🖨️ Print ${paper === "A4" ? "A4 Tax Invoice" : `${paper} Receipt`}</button>
  <button onclick="window.print()">Save as PDF</button>
  <button onclick="window.close()">Close</button>
</div>
</body>
</html>`;
}

export function printInvoice(invoice: InvoiceData, paper: PaperSize = "80mm") {
  const win = window.open("", "_blank", "width=480,height=720");
  if (!win) {
    throw new Error("Popup blocked — allow popups to print invoices");
  }
  win.document.write(buildInvoiceHTML(invoice, paper));
  win.document.close();
}

/** WhatsApp share text built from the saved invoice snapshot. */
export function invoiceToWhatsAppText(invoice: InvoiceData): string {
  const date = new Date(invoice.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  let msg = `🧾 *${storeInfo.name}*\n━━━━━━━━━━━━━━\n📄 Invoice: ${invoice.invoice_no}\n📅 ${date}\n👤 ${invoice.customer_name || "Walk-in Customer"}\n━━━━━━━━━━━━━━\n\n🛒 *ITEMS:*\n\n`;
  invoice.items.forEach(l => {
    msg += `${l.line_no}. ${l.name} (${l.unit})\n   ${qty(l.quantity)} × ₹${l.unit_price.toFixed(0)}${l.discount_pct ? ` (-${l.discount_pct}%)` : ""} = ₹${l.line_total.toFixed(0)}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━\n`;
  msg += `Subtotal: ₹${invoice.subtotal.toFixed(0)}\n`;
  if (invoice.discount_total > 0) msg += `Discount: -₹${invoice.discount_total.toFixed(0)}\n`;
  if (invoice.gst_total > 0) msg += `GST (CGST+SGST): ₹${invoice.gst_total.toFixed(2)}\n`;
  msg += `💰 *TOTAL: ₹${invoice.grand_total.toFixed(0)}*\n`;
  msg += `💳 Payment: ${PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method} (${invoice.payment_status})\n`;
  if (invoice.balance_due > 0) msg += `⚠️ Balance due: ₹${invoice.balance_due.toFixed(0)}\n`;
  msg += `━━━━━━━━━━━━━━\n🙏 *Thank you for visiting our shop!*`;
  return msg;
}

export function shareInvoiceOnWhatsApp(invoice: InvoiceData, toPhone?: string | null) {
  const target = toPhone && toPhone.length >= 10 ? toPhone.replace(/\D/g, "") : storeInfo.whatsappNumber;
  const url = `https://wa.me/${target.startsWith("91") || target.length > 10 ? target : `91${target}`}?text=${encodeURIComponent(invoiceToWhatsAppText(invoice))}`;
  window.open(url, "_blank");
}
