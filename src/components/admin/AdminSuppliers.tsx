import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, X } from "lucide-react";
import { Supplier } from "@/hooks/useAdmin";
import { toast } from "sonner";

interface Props {
  suppliers: Supplier[];
  onAddSupplier: (s: Omit<Supplier, "id" | "created_at" | "updated_at">) => Promise<{ error: unknown }>;
}

const AdminSuppliers = ({ suppliers, onAddSupplier }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", address: "", gst_number: "", products_supplied: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Name is required"); return; }
    const { error } = await onAddSupplier(form);
    if (error) toast.error("Failed to add supplier");
    else {
      toast.success("Supplier added!");
      setForm({ name: "", company: "", phone: "", email: "", address: "", gst_number: "", products_supplied: "", notes: "" });
      setShowForm(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Suppliers ({suppliers.length})</CardTitle>
          <Button variant={showForm ? "ghost" : "default"} size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <><Plus className="h-4 w-4 mr-1" /> Add Supplier</>}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6 p-4 bg-muted/50 rounded-xl">
            <Input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <Input placeholder="GST Number" value={form.gst_number} onChange={e => setForm({ ...form, gst_number: e.target.value })} />
            <Input placeholder="Products Supplied" value={form.products_supplied} onChange={e => setForm({ ...form, products_supplied: e.target.value })} className="col-span-2" />
            <div className="col-span-2 flex justify-end">
              <Button type="submit" size="sm">Save Supplier</Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.company || "—"}</TableCell>
                  <TableCell>{s.phone || "—"}</TableCell>
                  <TableCell className="text-sm">{s.gst_number || "—"}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{s.products_supplied || "—"}</TableCell>
                </TableRow>
              ))}
              {suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No suppliers added yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSuppliers;
