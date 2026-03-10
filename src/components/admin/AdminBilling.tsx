import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, Trash2, Receipt, Download, Printer } from "lucide-react";
import { products, storeInfo } from "@/data/storeData";
import { Product, CartItem } from "@/types/store";
import { generateInvoicePDF } from "@/lib/invoicePdf";
import { toast } from "sonner";

const GST_RATE = 0; // Set to 5, 12, 18 as needed

const AdminBilling = () => {
  const [search, setSearch] = useState("");
  const [billItems, setBillItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameHindi?.includes(search) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8);
  }, [search]);

  const addItem = (product: Product) => {
    setBillItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSearch("");
    searchRef.current?.focus();
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setBillItems(prev => prev.filter(i => i.id !== id));
      return;
    }
    setBillItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const removeItem = (id: string) => setBillItems(prev => prev.filter(i => i.id !== id));

  const subtotal = billItems.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const gstAmount = subtotal * GST_RATE / 100;
  const grandTotal = subtotal + gstAmount;
  const totalItems = billItems.reduce((sum, i) => sum + i.quantity, 0);

  const handlePrintInvoice = () => {
    if (billItems.length === 0) { toast.error("Add items to bill first"); return; }
    generateInvoicePDF({
      id: Date.now().toString(),
      items: billItems,
      total_amount: grandTotal,
      created_at: new Date().toISOString(),
      customer_name: customerName || "Walk-in Customer",
      customer_phone: customerPhone,
      status: "paid",
    });
    toast.success("Invoice generated!");
  };

  const handleNewBill = () => {
    setBillItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setSearch("");
    toast.info("New bill started");
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6 animate-fade-in">
      {/* Left: Product Search & List */}
      <div className="lg:col-span-3 space-y-4">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Search product by name, barcode or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-12 text-base"
                autoFocus
              />
            </div>
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-border rounded-xl overflow-hidden divide-y divide-border">
                {searchResults.map(p => {
                  const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
                  return (
                    <button
                      key={p.id}
                      onClick={() => addItem(p)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.unit} · {p.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-primary">₹{price.toFixed(0)}</p>
                        {p.discount && <p className="text-xs text-muted-foreground line-through">₹{p.price}</p>}
                      </div>
                      <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Bill Items ({totalItems})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {billItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Search and add products to start billing</p>
              </div>
            ) : (
              <div className="space-y-2">
                {billItems.map((item, idx) => {
                  const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <span className="text-xs text-muted-foreground w-5">{idx + 1}</span>
                      <img src={item.image} alt={item.name} className="h-8 w-8 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unit} · ₹{price.toFixed(0)}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-sm text-foreground w-16 text-right">₹{(price * item.quantity).toFixed(0)}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Bill Summary */}
      <div className="lg:col-span-2">
        <Card className="sticky top-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <Input placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-9" />
              <Input placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="h-9" />
            </div>

            {/* Totals */}
            <div className="space-y-2 p-3 bg-muted/50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(0)}</span>
              </div>
              {GST_RATE > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST ({GST_RATE}%)</span>
                  <span className="font-medium">₹{gstAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-bold text-foreground">Grand Total</span>
                <span className="text-2xl font-bold text-primary">₹{grandTotal.toFixed(0)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">{totalItems} items</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="hero" size="lg" className="w-full" onClick={handlePrintInvoice} disabled={billItems.length === 0}>
                <Download className="h-4 w-4 mr-2" /> Generate Invoice
              </Button>
              <Button variant="outline" className="w-full" onClick={handleNewBill}>
                <Receipt className="h-4 w-4 mr-2" /> New Bill
              </Button>
            </div>

            {/* Store Info */}
            <div className="text-center space-y-1 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground">{storeInfo.name}</p>
              <p className="text-[10px] text-muted-foreground">{storeInfo.fullAddress}</p>
              <p className="text-[10px] text-muted-foreground">📞 {storeInfo.contact}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBilling;
