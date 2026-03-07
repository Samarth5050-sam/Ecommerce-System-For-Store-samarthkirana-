import { useState } from "react";
import { format } from "date-fns";
import { AdminOrder } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoicePdf";
import { toast } from "sonner";

interface Props {
  orders: AdminOrder[];
  onUpdateStatus: (orderId: string, status: string) => Promise<{ error: unknown }>;
  onRefetch: () => void;
}

const AdminOrders = ({ orders, onUpdateStatus, onRefetch }: Props) => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await onUpdateStatus(orderId, status);
    if (error) toast.error("Failed to update status");
    else toast.success(`Order marked as ${status}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">All Orders ({orders.length})</CardTitle>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={onRefetch}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(order.created_at), "dd MMM yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{order.customer_name}</p>
                      {order.customer_phone && <p className="text-xs text-muted-foreground">{order.customer_phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{order.items.length} items</TableCell>
                  <TableCell className="font-bold text-primary">₹{order.total_amount.toFixed(0)}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateInvoicePDF(order)}
                    >
                      <Download className="h-3 w-3 mr-1" /> Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No orders found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
