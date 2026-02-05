import { X, Plus, Minus, ShoppingBag, Trash2, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@/types/store";
import { storeInfo } from "@/data/storeData";
import CartRecommendations from "./CartRecommendations";
import { useAuth } from "@/contexts/AuthContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onAddToCart: (product: Product) => void;
  onPlaceOrder?: (items: CartItem[], totalAmount: number) => Promise<unknown>;
}

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onAddToCart,
  onPlaceOrder,
}: CartSidebarProps) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleWhatsAppOrder = () => {
    const orderText = cartItems
      .map((item) => `• ${item.name} x${item.quantity} - ₹${(item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity}`)
      .join("\n");
    
    const message = `🛒 *New Order from ${storeInfo.name}*\n\n${orderText}\n\n💰 *Total: ₹${cartTotal.toFixed(0)}*\n\n📍 Please confirm availability and delivery time.`;
    const whatsappUrl = `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePlaceOrder = async () => {
    if (onPlaceOrder) {
      const result = await onPlaceOrder(cartItems, cartTotal);
      if (result) {
        onClearCart();
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl hero-gradient flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
              <p className="text-sm text-muted-foreground">{cartItems.length} items</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some products to get started!</p>
              <Button variant="default" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-muted/50 rounded-xl animate-scale-in"
                  >
                    {/* Product Icon */}
                    <div className="h-16 w-16 rounded-lg bg-card flex items-center justify-center text-2xl flex-shrink-0">
                      {item.category === "grains" && "🌾"}
                      {item.category === "pulses" && "🫘"}
                      {item.category === "spices" && "🌶️"}
                      {item.category === "oils" && "🫒"}
                      {item.category === "dairy" && "🥛"}
                      {item.category === "snacks" && "🍿"}
                      {item.category === "beverages" && "☕"}
                      {item.category === "personal" && "🧴"}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ₹{(price * item.quantity).toFixed(0)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1 bg-card rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Recommendations */}
          {cartItems.length > 0 && (
            <CartRecommendations cartItems={cartItems} onAddToCart={onAddToCart} />
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold text-foreground">₹{cartTotal.toFixed(0)}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {user && onPlaceOrder && (
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={handlePlaceOrder}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Place Order
                </Button>
              )}
              <Button 
                variant={user ? "outline" : "hero"} 
                size="lg" 
                className="w-full"
                onClick={handleWhatsAppOrder}
              >
                <Phone className="h-5 w-5 mr-2" />
                Order via WhatsApp
              </Button>
              <Button 
                variant="ghost" 
                size="default" 
                className="w-full"
                onClick={onClearCart}
              >
                Clear Cart
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Call us at <a href={`tel:${storeInfo.contact}`} className="text-primary font-medium">{storeInfo.contact}</a> for any queries
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
