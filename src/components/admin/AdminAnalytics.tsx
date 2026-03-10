import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOrder, CustomerProfile } from "@/hooks/useAdmin";
import { format, subDays, startOfDay, subWeeks, startOfWeek, startOfMonth, subMonths } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

interface Props {
  orders: AdminOrder[];
  customers: CustomerProfile[];
}

const COLORS = ["hsl(25, 85%, 50%)", "hsl(142, 50%, 40%)", "hsl(35, 90%, 55%)", "hsl(200, 70%, 50%)", "hsl(280, 60%, 55%)", "hsl(0, 70%, 55%)"];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 };

const AdminAnalytics = ({ orders, customers }: Props) => {
  // Daily revenue (30 days)
  const dailyRevenue = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStart = startOfDay(day);
      const nextDay = startOfDay(subDays(new Date(), i - 1));
      const dayOrders = orders.filter(o => { const d = new Date(o.created_at); return d >= dayStart && d < nextDay; });
      days.push({
        date: format(day, "dd"),
        revenue: dayOrders.reduce((s, o) => s + o.total_amount, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  // Weekly revenue (12 weeks)
  const weeklyRevenue = useMemo(() => {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = startOfWeek(subWeeks(new Date(), i - 1));
      const weekOrders = orders.filter(o => { const d = new Date(o.created_at); return d >= weekStart && d < weekEnd; });
      weeks.push({
        week: `W${12 - i}`,
        revenue: weekOrders.reduce((s, o) => s + o.total_amount, 0),
        orders: weekOrders.length,
      });
    }
    return weeks;
  }, [orders]);

  // Monthly revenue (6 months)
  const monthlyRevenue = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = startOfMonth(subMonths(new Date(), i));
      const mEnd = startOfMonth(subMonths(new Date(), i - 1));
      const mOrders = orders.filter(o => { const d = new Date(o.created_at); return d >= mStart && (i === 0 || d < mEnd); });
      months.push({
        month: format(mStart, "MMM"),
        revenue: mOrders.reduce((s, o) => s + o.total_amount, 0),
        orders: mOrders.length,
      });
    }
    return months;
  }, [orders]);

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(o => o.items.forEach(item => {
      if (!map[item.id]) map[item.id] = { name: item.name, qty: 0, revenue: 0 };
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      map[item.id].qty += item.quantity;
      map[item.id].revenue += price * item.quantity;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [orders]);

  // Category split
  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(item => {
      const cat = item.category || "other";
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      map[cat] = (map[cat] || 0) + price * item.quantity;
    }));
    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: Math.round(value) }));
  }, [orders]);

  // Customer growth
  const customerGrowth = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = startOfMonth(subMonths(new Date(), i));
      const count = customers.filter(c => new Date(c.created_at) <= (i === 0 ? new Date() : startOfMonth(subMonths(new Date(), i - 1)))).length;
      months.push({ month: format(mStart, "MMM"), customers: count });
    }
    return months;
  }, [customers]);

  const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
          { label: "Total Orders", value: orders.length.toString() },
          { label: "Total Customers", value: customers.length.toString() },
          { label: "Avg Order Value", value: `₹${(orders.length > 0 ? totalRevenue / orders.length : 0).toFixed(0)}` },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Daily Revenue */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Daily Revenue (30 Days)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyRevenue}>
              <defs>
                <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25, 85%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(25, 85%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(25, 85%, 50%)" fill="url(#dailyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Weekly Revenue (12 Weeks)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(142, 50%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Revenue (6 Months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(35, 90%, 55%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(35, 90%, 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryRevenue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Customer Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={customerGrowth}>
                <defs>
                  <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis fontSize={10} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="customers" stroke="hsl(200, 70%, 50%)" fill="url(#custGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top 10 Products by Revenue</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topProducts.map((p, i) => {
              const maxRev = topProducts[0]?.revenue || 1;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{p.name}</span>
                      <span className="text-primary font-bold">₹{p.revenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full hero-gradient rounded-full transition-all duration-500" style={{ width: `${(p.revenue / maxRev * 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.qty} units sold</p>
                  </div>
                </div>
              );
            })}
            {topProducts.length === 0 && <p className="text-muted-foreground text-center py-6 text-sm">No sales data yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
