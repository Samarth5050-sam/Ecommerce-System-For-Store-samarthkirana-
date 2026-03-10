import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Package, ShoppingCart, TrendingUp, CheckCircle } from "lucide-react";
import { products } from "@/data/storeData";
import { AdminOrder } from "@/hooks/useAdmin";
import { format, isAfter, subHours, startOfDay } from "date-fns";

interface Props {
  orders: AdminOrder[];
}

const AdminNotifications = ({ orders }: Props) => {
  const notifications = useMemo(() => {
    const alerts: { id: string; type: "warning" | "info" | "success" | "urgent"; title: string; message: string; time: string; icon: typeof Bell }[] = [];

    // Out of stock alerts
    const outOfStock = products.filter(p => !p.inStock);
    if (outOfStock.length > 0) {
      alerts.push({
        id: "oos", type: "urgent", icon: AlertTriangle,
        title: "Out of Stock Products",
        message: `${outOfStock.length} products are out of stock: ${outOfStock.slice(0, 3).map(p => p.name).join(", ")}${outOfStock.length > 3 ? ` +${outOfStock.length - 3} more` : ""}`,
        time: "Now",
      });
    }

    // Recent orders (last 24h)
    const recentOrders = orders.filter(o => isAfter(new Date(o.created_at), subHours(new Date(), 24)));
    if (recentOrders.length > 0) {
      alerts.push({
        id: "recent", type: "info", icon: ShoppingCart,
        title: "Recent Orders",
        message: `${recentOrders.length} new orders in the last 24 hours totaling ₹${recentOrders.reduce((s, o) => s + o.total_amount, 0).toLocaleString("en-IN")}`,
        time: "Last 24h",
      });
    }

    // Pending orders
    const pending = orders.filter(o => o.status === "pending");
    if (pending.length > 0) {
      alerts.push({
        id: "pending", type: "warning", icon: Package,
        title: "Pending Orders",
        message: `${pending.length} orders are pending review. Total value: ₹${pending.reduce((s, o) => s + o.total_amount, 0).toLocaleString("en-IN")}`,
        time: "Action needed",
      });
    }

    // Today's sales milestone
    const today = startOfDay(new Date());
    const todayRevenue = orders.filter(o => isAfter(new Date(o.created_at), today)).reduce((s, o) => s + o.total_amount, 0);
    if (todayRevenue > 0) {
      alerts.push({
        id: "today", type: "success", icon: TrendingUp,
        title: "Today's Sales Update",
        message: `Today's revenue is ₹${todayRevenue.toLocaleString("en-IN")} from ${orders.filter(o => isAfter(new Date(o.created_at), today)).length} orders`,
        time: format(new Date(), "hh:mm a"),
      });
    }

    // Low discount products notification
    const discounted = products.filter(p => p.discount);
    if (discounted.length > 0) {
      alerts.push({
        id: "disc", type: "info", icon: Bell,
        title: "Active Promotions",
        message: `${discounted.length} products currently on discount. Monitor sales performance.`,
        time: "Ongoing",
      });
    }

    // System health
    alerts.push({
      id: "sys", type: "success", icon: CheckCircle,
      title: "System Status",
      message: `All systems operational. ${products.length} products in catalog, ${orders.length} total orders processed.`,
      time: format(new Date(), "hh:mm a"),
    });

    return alerts;
  }, [orders]);

  const typeStyles = {
    urgent: "border-destructive/30 bg-destructive/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    info: "border-blue-500/30 bg-blue-500/5",
    success: "border-secondary/30 bg-secondary/5",
  };

  const iconStyles = {
    urgent: "text-destructive bg-destructive/10",
    warning: "text-amber-500 bg-amber-500/10",
    info: "text-blue-500 bg-blue-500/10",
    success: "text-secondary bg-secondary/10",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Alerts", value: notifications.length, color: "text-primary" },
          { label: "Urgent", value: notifications.filter(n => n.type === "urgent").length, color: "text-destructive" },
          { label: "Warnings", value: notifications.filter(n => n.type === "warning").length, color: "text-amber-500" },
          { label: "Info", value: notifications.filter(n => n.type === "info" || n.type === "success").length, color: "text-blue-500" },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Notification List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" /> All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border ${typeStyles[n.type]} transition-colors hover:shadow-sm`}>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles[n.type]}`}>
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                    <Badge variant="outline" className="text-[10px] capitalize">{n.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
