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
import FavoritesSheet from "@/components/FavoritesSheet";
import OrderHistory from "@/components/OrderHistory";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
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

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { orders, loading: ordersLoading, createOrder } = useOrders();

  const handleShopNowClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen pattern-bg">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        favoritesCount={favorites.length}
      />
      
      <main>
        <HeroBanner onShopNowClick={handleShopNowClick} />
        
        <CategoryGrid
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Special Offers Section */}
        <SpecialOffers
          cartItems={cartItems}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        {/* Budget Friendly Section */}
        <BudgetSection
          cartItems={cartItems}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
        
        <div ref={productsRef} id="products">
          <ProductGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cartItems={cartItems}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
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
        onPlaceOrder={createOrder}
      />

      <FavoritesSheet
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
      />

      <OrderHistory
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        loading={ordersLoading}
      />
    </div>
  );
};

export default Index;
