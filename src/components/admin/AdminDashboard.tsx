import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminOrder, CustomerProfile } from "@/hooks/useAdmin";
import { InventoryItem } from "@/hooks/useInventory";
import { format, subDays, startOfDay, startOfMonth, isAfter } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, LineChart, Line
} from "recharts";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart,
  Users, Package, AlertTriangle, Star, Clock, XCircle, CheckCircle
} from "lucide-react";

interface Props {
  orders: AdminOrder[];
  customers: CustomerProfile[];
  inventory: InventoryItem[];
}

const CHART_COLORS = [
  "hsl(25, 85%, 50%)", "hsl(142, 50%, 40%)", "hsl(35, 90%, 55%)",
  "hsl(200, 70%, 50%)", "hsl(280, 60%, 55%)", "hsl(0, 70%, 55%)"
];

const AdminDashboard = ({ orders, customers, inventory }: Props) => {
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const monthStart = startOfMonth(new Date());
    const yesterday = startOfDay(subDays(new Date(), 1));

    const todayOrders = orders.filter(o => isAfter(new Date(o.created_at), today));
    const yesterdayOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return d >= yesterday && d < today;
    });
    const monthOrders = orders.filter(o => isAfter(new Date(o.created_at), monthStart));

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total_amount, 0);
    const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + o.total_amount, 0);
    const monthRevenue = monthOrders.reduce((s, o) => s + o.total_amount, 0);
    const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100)
      : todayRevenue > 0 ? 100 : 0;

    const lowStock = inventory.filter(i => i.stock_quantity > 0 && i.stock_quantity <= i.low_stock_threshold);
    const outOfStock = inventory.filter(i => i.stock_quantity === 0);
    const expiring = inventory.filter(i => {
      if (!i.expiry_date) return false;
      const diff = new Date(i.expiry_date).getTime() - Date.now();
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
    });

    return {
      todayOrders: todayOrders.length, monthOrders: monthOrders.length,
      todayRevenue, monthRevenue, totalRevenue, avgOrderValue,
      totalCustomers: customers.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      revenueChange,
      totalProducts: inventory.length,
      inStock: inventory.filter(i => i.stock_quantity > 0).length,
      lowStock, outOfStock, expiring,
    };
  }, [orders, customers, inventory]);

  const dailyData = useMemo(() => {
    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStart = startOfDay(day);
      const nextDay = startOfDay(subDays(new Date(), i - 1));
      const dayOrders = orders.filter(o => {
        const d = new Date(o.created_at);
        return d >= dayStart && d < nextDay;
      });
      days.push({
        date: format(day, "dd MMM"),
        revenue: dayOrders.reduce((s, o) => s + o.total_amount, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [orders]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(item => {
      const cat = item.category || "other";
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      map[cat] = (map[cat] || 0) + price * item.quantity;
    }));
    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: Math.round(value) })).sort((a, b) => b.value - a.value);
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      if (!map[item.id]) map[item.id] = { name: item.name, qty: 0, revenue: 0 };
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      map[item.id].qty += item.quantity;
      map[item.id].revenue += price * item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [orders]);

  const statCards = [
    { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", change: stats.revenueChange },
    { label: "Monthly Revenue", value: `₹${stats.monthRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Today's Orders", value: stats.todayOrders.toString(), icon: ShoppingCart, color: "text-accent", bg: "bg-accent/10" },
    { label: "Customers", value: stats.totalCustomers.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "In Stock", value: stats.inStock.toString(), icon: CheckCircle, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Avg Order", value: `₹${stats.avgOrderValue.toFixed(0)}`, icon: Star, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  {s.change !== undefined && (
                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${s.change >= 0 ? "text-secondary" : "text-destructive"}`}>
                      {s.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(s.change).toFixed(1)}% vs yesterday
                    </div>
                  )}
                </div>
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Stock Alerts */}
      {(stats.outOfStock.length > 0 || stats.lowStock.length > 0 || stats.expiring.length > 0) && (
        <div className="grid lg:grid-cols-3 gap-4">
          {stats.outOfStock.length > 0 && (
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" /> Out of Stock ({stats.outOfStock.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 max-h-40 overflow-y-auto">
                {stats.outOfStock.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{item.name}</span>
                    <Badge variant="destructive" className="text-[10px]">0 left</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {stats.lowStock.length > 0 && (
            <Card className="border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" /> Low Stock ({stats.lowStock.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 max-h-40 overflow-y-auto">
                {stats.lowStock.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{item.name}</span>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">{item.stock_quantity} left</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {stats.expiring.length > 0 && (
            <Card className="border-orange-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-600">
                  <Clock className="h-4 w-4" /> Expiring Soon ({stats.expiring.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 max-h-40 overflow-y-auto">
                {stats.expiring.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{item.name}</span>
                    <Badge variant="outline" className="text-[10px]">{item.expiry_date}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(25, 85%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(25, 85%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(25, 85%, 50%)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" fontSize={11} width={80} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="value" fill="hsl(142, 50%, 40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Daily Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke="hsl(35, 90%, 55%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(35, 90%, 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" /> Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  #{i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} sold · ₹{p.revenue.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="col-span-full text-muted-foreground text-center py-6 text-sm">No sales data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
