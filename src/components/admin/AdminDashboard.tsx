import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOrder, CustomerProfile } from "@/hooks/useAdmin";
import { format, subDays, startOfDay, startOfMonth, isAfter } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  orders: AdminOrder[];
  customers: CustomerProfile[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))"];

const AdminDashboard = ({ orders, customers }: Props) => {
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const monthStart = startOfMonth(new Date());

    const todayOrders = orders.filter(o => isAfter(new Date(o.created_at), today));
    const monthOrders = orders.filter(o => isAfter(new Date(o.created_at), monthStart));

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total_amount, 0);
    const monthRevenue = monthOrders.reduce((s, o) => s + o.total_amount, 0);
    const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      monthOrders: monthOrders.length,
      todayRevenue,
      monthRevenue,
      totalRevenue,
      totalCustomers: customers.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
    };
  }, [orders, customers]);

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
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      if (!map[item.id]) map[item.id] = { name: item.name, qty: 0, revenue: 0 };
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      map[item.id].qty += item.quantity;
      map[item.id].revenue += price * item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `₹${stats.todayRevenue.toFixed(0)}`, icon: "💰" },
          { label: "Monthly Revenue", value: `₹${stats.monthRevenue.toFixed(0)}`, icon: "📈" },
          { label: "Today's Orders", value: stats.todayOrders, icon: "📦" },
          { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳" },
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toFixed(0)}`, icon: "🏦" },
          { label: "Total Orders", value: stats.totalOrders, icon: "🛒" },
          { label: "Monthly Orders", value: stats.monthOrders, icon: "📅" },
          { label: "Total Customers", value: stats.totalCustomers, icon: "👥" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Last 7 Days Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => `₹${v}`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader><CardTitle className="text-base">🏆 Top Selling Products</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <span className="font-medium text-foreground">{p.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{p.revenue.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-muted-foreground text-center py-4">No sales data yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
