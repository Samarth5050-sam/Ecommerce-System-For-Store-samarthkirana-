import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/storeData";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden hero-gradient py-12 md:py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-subtle">🌾</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce-subtle delay-100">🥛</div>
        <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce-subtle delay-200">🌶️</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-bounce-subtle delay-300">🫒</div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">
              Fresh Daily Essentials
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
            {storeInfo.tagline}
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Quality groceries at affordable prices. Serving {storeInfo.address} with love and trust for years.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="accent" size="xl" className="group">
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              View All Products
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-primary-foreground/20">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/80">Products</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">10+</p>
              <p className="text-sm text-primary-foreground/80">Years Serving</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">1000+</p>
              <p className="text-sm text-primary-foreground/80">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
