import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, LogOut, Store, LayoutDashboard, Package, ShoppingCart,
  Users, Truck, BarChart3, Tag, Bell, Receipt
} from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminSuppliers from "@/components/admin/AdminSuppliers";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminBilling from "@/components/admin/AdminBilling";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminDiscounts from "@/components/admin/AdminDiscounts";
import AdminNotifications from "@/components/admin/AdminNotifications";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "billing", label: "Billing / POS", icon: Receipt },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "discounts", label: "Discounts", icon: Tag },
  { id: "notifications", label: "Alerts", icon: Bell },
];

const Admin = () => {
  const { isAdmin, loading, orders, customers, suppliers, addSupplier, updateOrderStatus, refetchOrders } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin-login");
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboard orders={orders} customers={customers} />;
      case "billing": return <AdminBilling />;
      case "orders": return <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} onRefetch={refetchOrders} />;
      case "inventory": return <AdminInventory />;
      case "customers": return <AdminCustomers customers={customers} orders={orders} />;
      case "suppliers": return <AdminSuppliers suppliers={suppliers} onAddSupplier={addSupplier} />;
      case "analytics": return <AdminAnalytics orders={orders} customers={customers} />;
      case "discounts": return <AdminDiscounts />;
      case "notifications": return <AdminNotifications orders={orders} />;
      default: return <AdminDashboard orders={orders} customers={customers} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-60"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-foreground truncate">Samarth Kirana</h1>
              <p className="text-[10px] text-muted-foreground">Smart ERP System</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Store className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>View Store</span>}
          </button>
          <button
            onClick={() => { signOut(); navigate("/admin-login"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-60"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-foreground capitalize">
                {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-primary-foreground">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
