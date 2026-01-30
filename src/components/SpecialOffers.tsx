import { Flame, Timer } from "lucide-react";
import { getDiscountedProducts } from "@/data/storeData";
import { CartItem, Product } from "@/types/store";
import ProductCard from "./ProductCard";

interface SpecialOffersProps {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const SpecialOffers = ({ cartItems, onAddToCart, onUpdateQuantity }: SpecialOffersProps) => {
  const discountedProducts = getDiscountedProducts().slice(0, 8);

  if (discountedProducts.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                Special Offers
                <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded-full animate-pulse">
                  Limited Time
                </span>
              </h2>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Grab these deals before they're gone!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {discountedProducts.map((product, index) => (
            <div 
              key={product.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-scale-in"
            >
              <ProductCard
                product={product}
                cartItem={cartItems.find((item) => item.id === product.id)}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
