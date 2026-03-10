import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Gift, Percent, Calendar, Star } from "lucide-react";
import { products } from "@/data/storeData";

const festivalOffers = [
  { name: "Diwali Mega Sale", discount: "20% OFF", period: "Oct 15 - Nov 5", status: "upcoming", icon: "🪔" },
  { name: "Holi Special", discount: "15% OFF", period: "Mar 1 - Mar 15", status: "active", icon: "🎨" },
  { name: "Navratri Offer", discount: "10% OFF", period: "Oct 1 - Oct 10", status: "upcoming", icon: "🙏" },
  { name: "Raksha Bandhan", discount: "12% OFF", period: "Aug 15 - Aug 20", status: "expired", icon: "🎗️" },
];

const comboDeals = [
  { name: "Buy 2 Get 1 Free", description: "On all Soaps & Detergents", items: "Lux, Dettol, Santoor", savings: "₹35-80" },
  { name: "Rice + Dal Combo", description: "1kg Basmati + 1kg Toor Dal", items: "Premium combo", savings: "₹25" },
  { name: "Tea + Sugar Pack", description: "500g Tea + 1kg Sugar", items: "Tata Tea + Sugar", savings: "₹15" },
  { name: "Spice Kit", description: "Buy any 5 spice packs", items: "Everest / Suhana range", savings: "₹40" },
];

const AdminDiscounts = () => {
  const discountedProducts = products.filter(p => p.discount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Discounts", value: discountedProducts.length, icon: Percent, color: "text-primary" },
          { label: "Festival Offers", value: festivalOffers.filter(f => f.status === "active").length, icon: Gift, color: "text-secondary" },
          { label: "Combo Deals", value: comboDeals.length, icon: Tag, color: "text-amber-500" },
          { label: "Upcoming Offers", value: festivalOffers.filter(f => f.status === "upcoming").length, icon: Calendar, color: "text-blue-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Festival Offers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" /> Festival Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {festivalOffers.map((offer, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-3xl">{offer.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-foreground">{offer.name}</h4>
                    <Badge variant={offer.status === "active" ? "default" : offer.status === "upcoming" ? "outline" : "secondary"}
                      className={offer.status === "active" ? "bg-secondary text-secondary-foreground" : ""}>
                      {offer.status}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">{offer.discount}</p>
                  <p className="text-xs text-muted-foreground">{offer.period}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Combo Deals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Combo Deals & Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {comboDeals.map((deal, i) => (
              <div key={i} className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                <h4 className="font-semibold text-foreground text-sm">{deal.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{deal.description}</p>
                <p className="text-xs text-muted-foreground">{deal.items}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">Save {deal.savings}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currently Discounted Products */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Percent className="h-4 w-4 text-destructive" /> Products on Discount ({discountedProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {discountedProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground line-through">₹{p.price}</span>
                    <span className="text-sm font-bold text-primary">₹{(p.price * (1 - (p.discount || 0) / 100)).toFixed(0)}</span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{p.discount}% OFF</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscounts;
