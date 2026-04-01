import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Package, AlertTriangle, CheckCircle, Filter, Plus, Pencil, Trash2, Clock, XCircle } from "lucide-react";
import { categories } from "@/data/storeData";
import { useInventory, InventoryInsert } from "@/hooks/useInventory";

const emptyForm: InventoryInsert = {
  product_id: "", name: "", name_hindi: null, category: "grains",
  price: 0, unit: "1 kg", image: null, stock_quantity: 0,
  low_stock_threshold: 10, expiry_date: null, discount: 0, barcode: null,
};

const AdminInventory = () => {
  const { items, loading, lowStockItems, outOfStockItems, expiringItems, addItem, updateItem, deleteItem } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InventoryInsert>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.name_hindi?.includes(search) ?? false) || (p.barcode?.includes(search) ?? false);
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "instock" && p.stock_quantity > 0) ||
        (stockFilter === "outofstock" && p.stock_quantity === 0) ||
        (stockFilter === "lowstock" && p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);
      return matchSearch && matchCategory && matchStock;
    });
  }, [items, search, categoryFilter, stockFilter]);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (item: typeof items[0]) => {
    setForm({
      product_id: item.product_id, name: item.name, name_hindi: item.name_hindi,
      category: item.category, price: item.price, unit: item.unit, image: item.image,
      stock_quantity: item.stock_quantity, low_stock_threshold: item.low_stock_threshold,
      expiry_date: item.expiry_date, discount: item.discount, barcode: item.barcode,
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.product_id) return;
    let ok: boolean;
    if (editingId) {
      ok = await updateItem(editingId, form);
    } else {
      ok = await addItem(form);
    }
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirm(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Products", value: items.length, icon: Package, color: "text-primary" },
          { label: "In Stock", value: items.filter(i => i.stock_quantity > 0).length, icon: CheckCircle, color: "text-secondary" },
          { label: "Out of Stock", value: outOfStockItems.length, icon: XCircle, color: "text-destructive" },
          { label: "Low Stock", value: lowStockItems.length, icon: AlertTriangle, color: "text-amber-500" },
          { label: "Expiring Soon", value: expiringItems.length, icon: Clock, color: "text-orange-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Add button */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <CardTitle className="text-sm font-semibold">Inventory ({filtered.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search / barcode..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48 h-9" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Stock" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                  <SelectItem value="lowstock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openAdd} className="h-9 gap-1">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Qty</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 100).map((p, idx) => {
                  const isLow = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
                  const isOut = p.stock_quantity === 0;
                  return (
                    <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {p.image && <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}
                          <div>
                            <p className="font-medium text-sm text-foreground">{p.name}</p>
                            {p.name_hindi && <p className="text-xs text-muted-foreground">{p.name_hindi}</p>}
                            {p.barcode && <p className="text-[10px] text-muted-foreground font-mono">{p.barcode}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {categories.find(c => c.id === p.category)?.icon} {p.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">₹{p.price}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${isOut ? "text-destructive" : isLow ? "text-amber-500" : "text-foreground"}`}>
                          {p.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.low_stock_threshold}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.expiry_date ? new Date(p.expiry_date).toLocaleDateString("en-IN") : "—"}
                      </TableCell>
                      <TableCell>
                        {isOut ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : isLow ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Low Stock</Badge>
                        ) : (
                          <Badge className="bg-secondary text-secondary-foreground">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(p.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                      {items.length === 0 ? "No products in inventory. Click 'Add Product' to get started." : "No products match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 100 && (
            <p className="text-xs text-muted-foreground text-center mt-4">Showing first 100 of {filtered.length} products</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Product ID *</Label>
                <Input value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} placeholder="e.g. rice-001" disabled={!!editingId} />
              </div>
              <div className="space-y-1.5">
                <Label>Barcode</Label>
                <Input value={form.barcode || ""} onChange={e => setForm(f => ({ ...f, barcode: e.target.value || null }))} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Name (Hindi)</Label>
                <Input value={form.name_hindi || ""} onChange={e => setForm(f => ({ ...f, name_hindi: e.target.value || null }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Stock Qty</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Low Threshold</Label>
                <Input type="number" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount %</Label>
                <Input type="number" value={form.discount || 0} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expiry_date || ""} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value || null }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={form.image || ""} onChange={e => setForm(f => ({ ...f, image: e.target.value || null }))} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.product_id}>{editingId ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this product from inventory.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
