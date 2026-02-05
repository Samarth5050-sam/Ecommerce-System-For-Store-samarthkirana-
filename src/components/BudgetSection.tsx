import { IndianRupee, Sparkles } from "lucide-react";
import { getBudgetProducts } from "@/data/storeData";
import { CartItem, Product } from "@/types/store";
import ProductCard from "./ProductCard";

interface BudgetSectionProps {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isFavorite?: (productId: string) => boolean;
  onToggleFavorite?: (productId: string) => void;
}

const BudgetSection = ({ 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity,
  isFavorite,
  onToggleFavorite,
}: BudgetSectionProps) => {
  const budgetProducts = getBudgetProducts().slice(0, 12);

  if (budgetProducts.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                Budget Friendly
                <span className="text-sm font-normal bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Under ₹50
                </span>
              </h2>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quality products at pocket-friendly prices
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {budgetProducts.map((product, index) => (
            <div 
              key={product.id} 
              style={{ animationDelay: `${index * 30}ms` }}
              className="animate-scale-in"
            >
              <ProductCard
                product={product}
                cartItem={cartItems.find((item) => item.id === product.id)}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                isFavorite={isFavorite?.(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BudgetSection;
