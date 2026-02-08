import { useState } from "react";
import { X, CheckCircle, QrCode, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/store";
import { storeInfo } from "@/data/storeData";
import qrImage from "@/assets/qr-payment.jpeg";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onPaymentComplete: () => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onPaymentComplete,
}: PaymentModalProps) => {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  if (!isOpen) return null;

  const generateInvoiceText = () => {
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

    let invoice = `📋 *INVOICE - ${storeInfo.name}*\n`;
    invoice += `━━━━━━━━━━━━━━━━━━━━\n`;
    invoice += `📄 Invoice No: ${invoiceNo}\n`;
    invoice += `📅 Date: ${date} | ⏰ ${time}\n`;
    invoice += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    invoice += `🛒 *ORDER DETAILS:*\n\n`;

    cartItems.forEach((item, idx) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      invoice += `${idx + 1}. ${item.name}\n`;
      invoice += `   📦 Qty: ${item.quantity} × ₹${price.toFixed(0)} = ₹${(price * item.quantity).toFixed(0)}\n\n`;
    });

    invoice += `━━━━━━━━━━━━━━━━━━━━\n`;
    invoice += `💰 *TOTAL: ₹${cartTotal.toFixed(0)}*\n`;
    invoice += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    invoice += `💳 *Payment: ${paymentConfirmed ? "✅ Paid Online (UPI)" : "⏳ Pending"}*\n\n`;
    invoice += `🙏 *Thank you for visiting ${storeInfo.name}!*\n`;
    invoice += `📍 ${storeInfo.fullAddress}\n`;
    invoice += `📞 ${storeInfo.contact}\n\n`;
    invoice += `_Your trusted neighborhood store_ 🏪`;

    return invoice;
  };

  const handleSendWhatsApp = () => {
    const message = generateInvoiceText();
    const whatsappUrl = `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
  };

  const handleComplete = () => {
    handleSendWhatsApp();
    onPaymentComplete();
    setPaymentConfirmed(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {paymentConfirmed ? "Payment Confirmed! ✅" : "Pay via UPI"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {!paymentConfirmed ? (
              <>
                {/* Order Summary */}
                <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
                  {cartItems.slice(0, 5).map((item, idx) => {
                    const price = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    return (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-foreground">
                          ₹{(price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                  {cartItems.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{cartItems.length - 5} more items
                    </p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{cartTotal.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Scan QR code to pay ₹{cartTotal.toFixed(0)}
                  </p>
                  <div className="bg-background rounded-xl p-4 inline-block mx-auto">
                    <img
                      src={qrImage}
                      alt="UPI QR Code - Samarth Shinde"
                      className="w-56 h-56 object-contain mx-auto rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    UPI ID: samarthrshinde5050@okaxis
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scan to pay with any UPI app
                  </p>
                </div>

                {/* Confirm Payment Button */}
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  I Have Paid ₹{cartTotal.toFixed(0)}
                </Button>
              </>
            ) : (
              <>
                {/* Payment Success */}
                <div className="text-center space-y-4 py-4">
                  <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Payment Completed! 🎉
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      ₹{cartTotal.toFixed(0)} paid successfully
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    🙏 Thank you for visiting our shop!
                  </p>
                </div>

                {/* Send Invoice on WhatsApp */}
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleComplete}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Send Invoice on WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your invoice will be sent to WhatsApp for your records
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
