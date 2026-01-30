import { useState, useMemo } from "react";
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { products, categories } from "@/data/storeData";
import { CartItem, Product } from "@/types/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "./ProductCard";

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc" | "discount";

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
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = searchLower
        ? product.name.toLowerCase().includes(searchLower) ||
          (product.nameHindi && product.nameHindi.includes(searchQuery))
        : true;
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "discount":
        filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortOption]);

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  const getSortIcon = () => {
    switch (sortOption) {
      case "price-low":
        return <ArrowUp className="h-4 w-4" />;
      case "price-high":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {selectedCategoryName || "All Products"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredAndSortedProducts.length} products available
              </p>
            </div>
            
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sort Dropdown */}
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-full sm:w-48 bg-background">
                  <div className="flex items-center gap-2">
                    {getSortIcon()}
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="discount">Best Discounts</SelectItem>
                </SelectContent>
              </Select>
              
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
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
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
            {filteredAndSortedProducts.map((product, index) => (
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
