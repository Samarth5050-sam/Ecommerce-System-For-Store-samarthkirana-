# Samarth Kirana — Master Upgrade (from user's MASTER_PROMPT)

Priority: preserve existing data → GST/billing correctness → invoices → inventory → pricing → reports → UI.

- [x] Phase 1: Inspect existing app (storeData 400+ products static, GST_RATE=0 hardcoded in invoicePdf.ts + AdminBilling.tsx, orders table but no invoices/payments/stock deduction)
- [ ] Phase 2: Centralized GST/billing calc lib (src/lib/billing.ts) — category-based GST rates, tax-inclusive/exclusive, CGST/SGST, rounding + tests
- [ ] Phase 2: DB migration — invoice-related columns on inventory (purchase_price, mrp, gst_rate, hsn_code, brand, package conversion), invoices/payments/stock_movements tables, atomic finalize_sale function
- [ ] Phase 3: Professional invoice layouts (58mm / 80mm / A4), PDF download, reprint from saved snapshot, WhatsApp share
- [ ] Phase 4: Catalogue — add bulk/wholesale variants (10/25/30 kg rice bags, sugar 5/10/25/50 kg, dals/atta bulk, detergent cartons); no duplicates, keep existing products
- [ ] Phase 5: Price management — purchase price, MRP, margin calc in AdminInventory
- [ ] Phase 6: Billing/checkout screen — stock validation, cash/change, payment method & status, partial payments, customer records
- [ ] Phase 7: Reports/dashboard from real saved invoices (daily/weekly/monthly sales, GST summary, low stock, valuation)
- [ ] Phase 8: Verify + final delivery report

Standing rules (from master prompt): never simulate successful DB ops; no fabricated business info (GSTIN/FSSAI left blank until owner supplies); demo invoices must not touch real stock/reports; reprint must not deduct stock twice.
