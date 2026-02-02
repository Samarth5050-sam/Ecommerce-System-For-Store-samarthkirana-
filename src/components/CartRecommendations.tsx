import { useState, useEffect } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@/types/store";
import { products } from "@/data/storeData";

interface CartRecommendationsProps {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
}

const CartRecommendations = ({ cartItems, onAddToCart }: CartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cartItems.length === 0) {
        setRecommendations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recommend-products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              cartItems: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
              })),
              productCatalog: products.map((p) => ({
                id: p.id,
                name: p.name,
                nameHindi: p.nameHindi,
                category: p.category,
                price: p.price,
                unit: p.unit,
              })),
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            setError("Too many requests. Please wait a moment.");
            return;
          }
          if (response.status === 402) {
            setError("AI feature temporarily unavailable.");
            return;
          }
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        
        if (data.recommendations && data.recommendations.length > 0) {
          // Map IDs to actual products
          const recommendedProducts = data.recommendations
            .map((id: string) => products.find((p) => p.id === id))
            .filter(Boolean) as Product[];
          
          // Filter out products already in cart
          const cartIds = cartItems.map((item) => item.id);
          const filteredRecommendations = recommendedProducts.filter(
            (p) => !cartIds.includes(p.id)
          );
          
          setRecommendations(filteredRecommendations);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error("Recommendation error:", err);
        setError("Could not load recommendations");
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchRecommendations, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems]);

  if (cartItems.length === 0) return null;

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      grains: "🌾",
      pulses: "🫘",
      spices: "🌶️",
      oils: "🫒",
      dairy: "🥛",
      snacks: "🍿",
      beverages: "☕",
      personal: "🧴",
    };
    return emojis[category] || "📦";
  };

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">You might also like</h3>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Finding recommendations...</span>
        </div>
      )}

      {error && (
        <p className="text-xs text-muted-foreground py-2">{error}</p>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-2">
          {recommendations.map((product) => {
            const price = product.discount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            return (
              <div
                key={product.id}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-card flex items-center justify-center text-lg flex-shrink-0">
                  {getCategoryEmoji(product.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">₹{price.toFixed(0)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => onAddToCart(product)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && cartItems.length > 0 && (
        <p className="text-xs text-muted-foreground py-2">
          Add more items to get personalized recommendations!
        </p>
      )}
    </div>
  );
};

export default CartRecommendations;
