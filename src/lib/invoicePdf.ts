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

export const generateInvoicePDF = (order: InvoiceOrder) => {
  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const time = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
  const invoiceNo = `INV-${order.id.slice(-8).toUpperCase()}`;

  const itemRows = order.items.map((item, idx) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    const total = price * item.quantity;
    return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${idx + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.name}<br><small style="color:#888">${item.unit}</small></td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${price.toFixed(0)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold">₹${total.toFixed(0)}</td>
      </tr>`;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceNo}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; color: #333; }
        .invoice { max-width: 700px; margin: auto; border: 2px solid #e65100; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #e65100, #ff8f00); color: white; padding: 24px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 4px 0 0; opacity: 0.9; font-size: 13px; }
        .meta { display: flex; justify-content: space-between; padding: 16px 24px; background: #fff8e1; }
        .meta div { font-size: 13px; }
        .meta strong { display: block; font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 2px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f5f5f5; padding: 10px 8px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
        .total-row td { padding: 12px 8px; font-size: 16px; font-weight: bold; border-top: 2px solid #e65100; }
        .footer { text-align: center; padding: 20px; background: #f9f9f9; border-top: 1px solid #eee; }
        .footer p { margin: 4px 0; font-size: 12px; color: #888; }
        @media print { body { padding: 0; } .invoice { border: none; } .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>🏪 ${storeInfo.name}</h1>
          <p>${storeInfo.fullAddress}</p>
          <p>📞 ${storeInfo.contact} | Owner: ${storeInfo.owner}</p>
        </div>
        
        <div class="meta">
          <div>
            <strong>Invoice No</strong> ${invoiceNo}
          </div>
          <div>
            <strong>Date</strong> ${date} | ${time}
          </div>
          <div>
            <strong>Customer</strong> ${order.customer_name || "Walk-in Customer"}
            ${order.customer_phone ? `<br>${order.customer_phone}` : ""}
          </div>
          <div>
            <strong>Status</strong> ${(order.status || "pending").toUpperCase()}
          </div>
        </div>

        <div style="padding:0 24px 16px">
          <table>
            <thead>
              <tr>
                <th style="text-align:center;width:40px">#</th>
                <th>Item</th>
                <th style="text-align:center;width:60px">Qty</th>
                <th style="text-align:right;width:80px">Price</th>
                <th style="text-align:right;width:90px">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4" style="text-align:right;padding-right:8px">Grand Total:</td>
                <td style="text-align:right;color:#e65100">₹${order.total_amount.toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="footer">
          <p><strong>🙏 Thank you for shopping at ${storeInfo.name}!</strong></p>
          <p>${storeInfo.tagline}</p>
          <p>This is a computer-generated invoice.</p>
        </div>
      </div>

      <div class="no-print" style="text-align:center;margin-top:20px">
        <button onclick="window.print()" style="padding:10px 24px;background:#e65100;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px">
          🖨️ Print / Download PDF
        </button>
      </div>
    </body>
    </html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
