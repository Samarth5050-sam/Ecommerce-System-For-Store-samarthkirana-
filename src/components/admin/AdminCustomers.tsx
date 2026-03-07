import { useMemo } from "react";
import { format } from "date-fns";
import { AdminOrder, CustomerProfile } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  customers: CustomerProfile[];
  orders: AdminOrder[];
}

const AdminCustomers = ({ customers, orders }: Props) => {
  const customerStats = useMemo(() => {
    return customers.map(c => {
      const customerOrders = orders.filter(o => o.user_id === c.user_id);
      const totalSpent = customerOrders.reduce((s, o) => s + o.total_amount, 0);
      return { ...c, orderCount: customerOrders.length, totalSpent };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Customers ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerStats.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.full_name || "—"}</TableCell>
                  <TableCell className="text-sm">{c.phone || "—"}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{c.address || "—"}</TableCell>
                  <TableCell>{c.orderCount}</TableCell>
                  <TableCell className="font-bold text-primary">₹{c.totalSpent.toFixed(0)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(c.created_at), "dd MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No customers yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCustomers;
