import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, Store } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminSuppliers from "@/components/admin/AdminSuppliers";

const Admin = () => {
  const { isAdmin, loading, orders, customers, suppliers, addSupplier, updateOrderStatus, refetchOrders } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin-login");
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl hero-gradient flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Samarth Kirana ERP</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Store className="h-4 w-4 mr-1" /> Store
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/admin-login"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="orders">📦 Orders</TabsTrigger>
            <TabsTrigger value="customers">👥 Customers</TabsTrigger>
            <TabsTrigger value="suppliers">🏭 Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard orders={orders} customers={customers} />
          </TabsContent>
          <TabsContent value="orders">
            <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} onRefetch={refetchOrders} />
          </TabsContent>
          <TabsContent value="customers">
            <AdminCustomers customers={customers} orders={orders} />
          </TabsContent>
          <TabsContent value="suppliers">
            <AdminSuppliers suppliers={suppliers} onAddSupplier={addSupplier} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
