import { Search, X } from "lucide-react";
import { products, categories } from "@/data/storeData";
import { CartItem, Product } from "@/types/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  selectedCategory: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductGrid = ({ 
  selectedCategory, 
  searchQuery,
  onSearchChange,
  cartItems, 
  onAddToCart, 
  onUpdateQuantity 
}: ProductGridProps) => {
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = searchLower
      ? product.name.toLowerCase().includes(searchLower)
      : true;
    return matchesCategory && matchesSearch;
  });

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {selectedCategoryName || "Featured Products"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} products available
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products or brands..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 h-11 bg-background border-border focus:border-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or clear the filter
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onSearchChange("")}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                style={{ animationDelay: `${index * 30}ms` }}
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
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
