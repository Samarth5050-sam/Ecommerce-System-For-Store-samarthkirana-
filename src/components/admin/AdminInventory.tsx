import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { products, categories } from "@/data/storeData";

const AdminInventory = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.nameHindi?.includes(search);
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchStock = stockFilter === "all" || (stockFilter === "instock" && p.inStock) || (stockFilter === "outofstock" && !p.inStock);
      return matchSearch && matchCategory && matchStock;
    });
  }, [search, categoryFilter, stockFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    discounted: products.filter(p => p.discount).length,
    categories: categories.length,
  }), []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Products", value: stats.total, icon: Package, color: "text-primary" },
          { label: "In Stock", value: stats.inStock, icon: CheckCircle, color: "text-secondary" },
          { label: "Out of Stock", value: stats.outOfStock, icon: AlertTriangle, color: "text-destructive" },
          { label: "On Discount", value: stats.discounted, icon: Package, color: "text-amber-500" },
          { label: "Categories", value: stats.categories, icon: Filter, color: "text-blue-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <CardTitle className="text-sm font-semibold">Product Inventory ({filtered.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48 h-9" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Stock" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map((p, idx) => (
                  <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{p.name}</p>
                          {p.nameHindi && <p className="text-xs text-muted-foreground">{p.nameHindi}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {categories.find(c => c.id === p.category)?.icon} {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">₹{p.price}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.unit}</TableCell>
                    <TableCell>
                      {p.discount ? (
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">{p.discount}% OFF</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.inStock ? "default" : "destructive"} className={p.inStock ? "bg-secondary text-secondary-foreground" : ""}>
                        {p.inStock ? "In Stock" : "Out"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No products found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 50 && (
            <p className="text-xs text-muted-foreground text-center mt-4">Showing first 50 of {filtered.length} products</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;
