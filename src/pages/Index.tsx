import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import SpecialOffers from "@/components/SpecialOffers";
import BudgetSection from "@/components/BudgetSection";
import ProductGrid from "@/components/ProductGrid";
import CartSidebar from "@/components/CartSidebar";
import LocationMap from "@/components/LocationMap";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);
  
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleShopNowClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pattern-bg">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <main>
        <HeroBanner onShopNowClick={handleShopNowClick} />
        
        <CategoryGrid
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Special Offers Section */}
        <SpecialOffers
          cartItems={cartItems}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
        />

        {/* Budget Friendly Section */}
        <BudgetSection
          cartItems={cartItems}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
        />
        
        <div ref={productsRef} id="products">
          <ProductGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cartItems={cartItems}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
          />
        </div>

        <LocationMap />
      </main>

      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default Index;
