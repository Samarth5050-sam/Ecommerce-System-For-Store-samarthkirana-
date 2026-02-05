import { Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, CartItem } from "@/types/store";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

const ProductCard = ({ 
  product, 
  cartItem, 
  onAddToCart, 
  onUpdateQuantity,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) => {
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Favorite button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card shadow-md",
              isFavorite && "text-destructive hover:text-destructive"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        )}
        
        {product.discount && (
          <div className="absolute top-2 left-2 accent-gradient text-accent-foreground text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            {product.discount}% OFF
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-destructive font-semibold bg-card px-3 py-1 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.nameHindi && (
          <p className="text-xs text-muted-foreground font-hindi mb-2">{product.nameHindi}</p>
        )}
        <p className="text-xs text-muted-foreground mb-3">{product.unit}</p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-primary">
            ₹{discountedPrice.toFixed(0)}
          </span>
          {product.discount && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {product.inStock && (
          <div className="mt-auto">
            {cartItem ? (
              <div className="flex items-center justify-between bg-muted rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10"
                  onClick={() => onUpdateQuantity(product.id, cartItem.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-foreground">{cartItem.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10"
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
    </div>
  );
};

export default ProductCard;
