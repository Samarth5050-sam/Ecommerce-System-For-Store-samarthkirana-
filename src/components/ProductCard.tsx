import { Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, CartItem } from "@/types/store";

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductCard = ({ product, cartItem, onAddToCart, onUpdateQuantity }: ProductCardProps) => {
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="group bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square mb-3 rounded-xl bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
          {product.category === "grains" && "🌾"}
          {product.category === "pulses" && "🫘"}
          {product.category === "spices" && "🌶️"}
          {product.category === "oils" && "🫒"}
          {product.category === "dairy" && "🥛"}
          {product.category === "snacks" && "🍿"}
          {product.category === "beverages" && "☕"}
          {product.category === "personal" && "🧴"}
        </div>
        
        {product.discount && (
          <div className="absolute top-2 left-2 accent-gradient text-accent-foreground text-xs font-bold px-2 py-1 rounded-lg">
            {product.discount}% OFF
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-destructive font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight mb-1">
          {product.name}
        </h3>
        {product.nameHindi && (
          <p className="text-xs text-muted-foreground font-hindi mb-2">{product.nameHindi}</p>
        )}
        <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            ₹{discountedPrice.toFixed(0)}
          </span>
          {product.discount && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      {product.inStock && (
        <div className="mt-auto">
          {cartItem ? (
            <div className="flex items-center justify-between bg-muted rounded-xl p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => onUpdateQuantity(product.id, cartItem.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-foreground">{cartItem.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="cart"
              className="w-full"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
