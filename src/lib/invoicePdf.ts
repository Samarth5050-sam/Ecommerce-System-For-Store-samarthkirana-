import { storeInfo } from "@/data/storeData";
import { CartItem } from "@/types/store";

interface InvoiceOrder {
  id: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  status?: string;
}

const GST_RATE = 0; // Set to 5, 12, 18 as needed

export const generateInvoicePDF = (order: InvoiceOrder) => {
  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const time = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
  const invoiceNo = `INV-${order.id.slice(-8).toUpperCase()}`;
  const gstAmount = order.total_amount * GST_RATE / 100;
  const subtotal = order.total_amount - gstAmount;

  const itemRows = order.items.map((item, idx) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    const total = price * item.quantity;
    return `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;color:#666;font-size:13px">${idx + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0">
          <div style="font-weight:500;font-size:13px;color:#1a1a1a">${item.name}</div>
          <div style="font-size:11px;color:#999;margin-top:2px">${item.unit}</div>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px">₹${price.toFixed(0)}</td>
        ${item.discount ? `<td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:11px;color:#e65100">${item.discount}%</td>` : `<td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:11px;color:#999">—</td>`}
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:13px">₹${total.toFixed(0)}</td>
      </tr>`;
  }).join("");

  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceNo} - ${storeInfo.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a1a; background: #f5f5f5; padding: 20px; }
        .invoice { max-width: 750px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #e65100 0%, #ff8f00 100%); color: white; padding: 32px; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .brand h1 { font-size: 24px; font-weight: 700; margin: 0; }
        .brand p { font-size: 12px; opacity: 0.9; margin-top: 4px; }
        .invoice-badge { background: rgba(255,255,255,0.2); border-radius: 8px; padding: 12px 16px; text-align: right; }
        .invoice-badge .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
        .invoice-badge .number { font-size: 18px; font-weight: 700; margin-top: 2px; }
        .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 20px 32px; background: #fef8f0; border-bottom: 1px solid #f0e8dc; }
        .meta-item { font-size: 12px; }
        .meta-item .label { color: #999; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; font-weight: 600; }
        .meta-item .value { color: #1a1a1a; font-weight: 500; margin-top: 4px; }
        .items { padding: 0 32px 24px; }
        .items table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .items th { padding: 12px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600; border-bottom: 2px solid #f0f0f0; }
        .totals { margin-top: 16px; border-top: 2px solid #e65100; padding-top: 16px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .total-row.grand { font-size: 20px; font-weight: 700; color: #e65100; padding: 12px 0; border-top: 1px solid #f0f0f0; margin-top: 8px; }
        .footer { text-align: center; padding: 24px 32px; background: #fafafa; border-top: 1px solid #f0f0f0; }
        .footer .thanks { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .footer .sub { font-size: 12px; color: #999; margin-top: 4px; }
        .footer .contact { font-size: 11px; color: #999; margin-top: 12px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .status-paid { background: #e8f5e9; color: #2e7d32; }
        .status-pending { background: #fff3e0; color: #e65100; }
        .no-print { text-align: center; margin-top: 24px; }
        .btn { padding: 12px 28px; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 0 6px; }
        .btn-primary { background: linear-gradient(135deg, #e65100, #ff8f00); color: white; }
        .btn-outline { background: white; color: #333; border: 2px solid #ddd; }
        @media print { 
          body { padding: 0; background: white; } 
          .invoice { box-shadow: none; border-radius: 0; } 
          .no-print { display: none; } 
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="header-top">
            <div class="brand">
              <h1>🏪 ${storeInfo.name}</h1>
              <p>${storeInfo.fullAddress}</p>
              <p>📞 ${storeInfo.contact} | Owner: ${storeInfo.owner}</p>
            </div>
            <div class="invoice-badge">
              <div class="label">Invoice</div>
              <div class="number">${invoiceNo}</div>
            </div>
          </div>
        </div>
        
        <div class="meta">
          <div class="meta-item">
            <div class="label">Date</div>
            <div class="value">${date}</div>
          </div>
          <div class="meta-item">
            <div class="label">Time</div>
            <div class="value">${time}</div>
          </div>
          <div class="meta-item">
            <div class="label">Customer</div>
            <div class="value">${order.customer_name || "Walk-in Customer"}</div>
            ${order.customer_phone ? `<div class="value" style="font-size:11px;color:#666">${order.customer_phone}</div>` : ""}
          </div>
          <div class="meta-item">
            <div class="label">Status</div>
            <div class="value">
              <span class="status-badge ${(order.status || "pending") === "paid" || (order.status || "pending") === "completed" ? "status-paid" : "status-pending"}">
                ${(order.status || "pending").toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div class="items">
          <table>
            <thead>
              <tr>
                <th style="text-align:center;width:40px">#</th>
                <th>Item Description</th>
                <th style="text-align:center;width:60px">Qty</th>
                <th style="text-align:right;width:80px">Rate</th>
                <th style="text-align:center;width:60px">Disc</th>
                <th style="text-align:right;width:90px">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span style="color:#666">Total Items</span>
              <span>${totalQty} items</span>
            </div>
            <div class="total-row">
              <span style="color:#666">Subtotal</span>
              <span>₹${subtotal.toFixed(0)}</span>
            </div>
            ${GST_RATE > 0 ? `<div class="total-row"><span style="color:#666">GST (${GST_RATE}%)</span><span>₹${gstAmount.toFixed(0)}</span></div>` : ""}
            <div class="total-row grand">
              <span>Grand Total</span>
              <span>₹${order.total_amount.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="thanks">🙏 Thank you for shopping with us!</div>
          <div class="sub">${storeInfo.tagline}</div>
          <div class="contact">
            ${storeInfo.fullAddress}<br>
            📞 ${storeInfo.contact} | 💬 WhatsApp: +${storeInfo.whatsappNumber}
          </div>
          <div style="margin-top:12px;font-size:10px;color:#ccc">This is a computer-generated invoice</div>
        </div>
      </div>

      <div class="no-print">
        <button onclick="window.print()" class="btn btn-primary">🖨️ Print Invoice</button>
        <button onclick="window.close()" class="btn btn-outline">Close</button>
      </div>
    </body>
    </html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
