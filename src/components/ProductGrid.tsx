import { products, categories } from "@/data/storeData";
import { CartItem, Product } from "@/types/store";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  selectedCategory: string | null;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductGrid = ({ selectedCategory, cartItems, onAddToCart, onUpdateQuantity }: ProductGridProps) => {
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {selectedCategoryName || "Featured Products"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} products available
          </p>
        </div>

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
      </div>
    </section>
  );
};

export default ProductGrid;
