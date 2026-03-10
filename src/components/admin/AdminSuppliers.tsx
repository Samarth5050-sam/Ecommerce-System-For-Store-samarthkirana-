import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, X, Truck, Search, Building, Phone, Mail } from "lucide-react";
import { Supplier } from "@/hooks/useAdmin";
import { toast } from "sonner";

interface Props {
  suppliers: Supplier[];
  onAddSupplier: (s: Omit<Supplier, "id" | "created_at" | "updated_at">) => Promise<{ error: unknown }>;
}

const AdminSuppliers = ({ suppliers, onAddSupplier }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
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

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company?.toLowerCase().includes(search.toLowerCase()) ||
    s.products_supplied?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Suppliers", value: suppliers.length, icon: Truck, color: "text-primary" },
          { label: "With GST", value: suppliers.filter(s => s.gst_number).length, icon: Building, color: "text-secondary" },
          { label: "With Phone", value: suppliers.filter(s => s.phone).length, icon: Phone, color: "text-accent" },
          { label: "With Email", value: suppliers.filter(s => s.email).length, icon: Mail, color: "text-blue-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Supplier Directory ({filtered.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48 h-9" />
              </div>
              <Button variant={showForm ? "ghost" : "default"} size="sm" className="h-9" onClick={() => setShowForm(!showForm)}>
                {showForm ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <><Plus className="h-4 w-4 mr-1" /> Add Supplier</>}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3 mb-6 p-4 bg-muted/50 rounded-xl border border-border">
              <Input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-9" />
              <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="h-9" />
              <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-9" />
              <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-9" />
              <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="h-9" />
              <Input placeholder="GST Number" value={form.gst_number} onChange={e => setForm({ ...form, gst_number: e.target.value })} className="h-9" />
              <Input placeholder="Products Supplied" value={form.products_supplied} onChange={e => setForm({ ...form, products_supplied: e.target.value })} className="sm:col-span-2 h-9" />
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" size="sm">Save Supplier</Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          {s.address && <p className="text-xs text-muted-foreground truncate max-w-[150px]">{s.address}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.company || "—"}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {s.phone && <p className="text-xs text-foreground">📞 {s.phone}</p>}
                        {s.email && <p className="text-xs text-muted-foreground">✉️ {s.email}</p>}
                        {!s.phone && !s.email && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {s.gst_number ? <Badge variant="outline" className="text-xs">{s.gst_number}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate text-muted-foreground">{s.products_supplied || "—"}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No suppliers found</TableCell>
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

export default AdminSuppliers;
