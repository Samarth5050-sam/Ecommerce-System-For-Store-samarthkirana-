import { useMemo, useState } from "react";
import { format } from "date-fns";
import { AdminOrder, CustomerProfile } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Star, IndianRupee, ShoppingCart } from "lucide-react";

interface Props {
  customers: CustomerProfile[];
  orders: AdminOrder[];
}

const LOYALTY_RATE = 10; // 1 point per ₹10 spent

const AdminCustomers = ({ customers, orders }: Props) => {
  const [search, setSearch] = useState("");

  const customerStats = useMemo(() => {
    return customers.map(c => {
      const customerOrders = orders.filter(o => o.user_id === c.user_id);
      const totalSpent = customerOrders.reduce((s, o) => s + o.total_amount, 0);
      const loyaltyPoints = Math.floor(totalSpent / LOYALTY_RATE);
      const lastOrder = customerOrders.length > 0 ? customerOrders[0].created_at : null;
      return { ...c, orderCount: customerOrders.length, totalSpent, loyaltyPoints, lastOrder };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders]);

  const filtered = customerStats.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpentAll = customerStats.reduce((s, c) => s + c.totalSpent, 0);
  const totalLoyalty = customerStats.reduce((s, c) => s + c.loyaltyPoints, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: customers.length, icon: Users, color: "text-primary" },
          { label: "Total Revenue", value: `₹${totalSpentAll.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-secondary" },
          { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-accent" },
          { label: "Loyalty Points Issued", value: totalLoyalty.toLocaleString("en-IN"), icon: Star, color: "text-amber-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Customer Directory ({filtered.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-56 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c, idx) => (
                  <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                          {(c.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.full_name || "—"}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{c.address || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.orderCount}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-primary">₹{c.totalSpent.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-sm font-medium">{c.loyaltyPoints}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.lastOrder ? format(new Date(c.lastOrder), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(c.created_at), "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No customers found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
