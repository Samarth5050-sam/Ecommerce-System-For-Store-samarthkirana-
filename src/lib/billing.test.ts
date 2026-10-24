import { describe, it, expect } from "vitest";
import { computeInvoice, computeLine, computeProfit, packageToBase, validateLine } from "./billing";

// GST-rate rules the shop relies on:
// - packaged staples (grains, pulses, sugar, oils) default 5%, GST-inclusive
// - personal care (soaps, detergents, shampoo) 18%
// - exempt products carry rate 0 and must show no tax
describe("GST calculations", () => {
  it("applies 5% inclusive GST on a packaged staple", () => {
    const line = computeLine({ product_id: "g1", name: "Sona Masoori Rice 5kg", unit: "5 kg", quantity: 1, unit_price: 320, gst_rate: 5, tax_inclusive: true });
    expect(line.taxable_value).toBeCloseTo(304.76, 2);
    expect(line.gst_amount).toBeCloseTo(15.24, 2);
    expect(line.line_total).toBe(320);
  });

  it("splits GST equally into CGST and SGST", () => {
    const line = computeLine({ product_id: "pc1", name: "Lifebuoy Soap", unit: "100 g", quantity: 2, unit_price: 38, gst_rate: 18, tax_inclusive: true });
    expect(line.gst_amount).toBeCloseTo(line.cgst + line.sgst, 2);
    expect(line.cgst).toBeCloseTo(line.sgst, 2);
  });

  it("shows zero GST for exempt (0%) products", () => {
    const line = computeLine({ product_id: "x1", name: "Loose Wheat", unit: "kg", quantity: 5, unit_price: 29, gst_rate: 0, tax_inclusive: true });
    expect(line.gst_amount).toBe(0);
    expect(line.taxable_value).toBe(145);
  });

  it("adds GST on top for tax-exclusive pricing", () => {
    const line = computeLine({ product_id: "pc2", name: "Wheel Detergent 1kg", unit: "1 kg", quantity: 1, unit_price: 98, gst_rate: 18, tax_inclusive: false });
    expect(line.taxable_value).toBe(98);
    expect(line.gst_amount).toBeCloseTo(17.64, 2);
    expect(line.line_total).toBeCloseTo(115.64, 2);
  });

  it("never charges GST twice on tax-inclusive prices", () => {
    const inv = computeInvoice([
      { product_id: "g1", name: "Rice", unit: "1 kg", quantity: 10, unit_price: 68, gst_rate: 5, tax_inclusive: true },
    ]);
    expect(inv.grand_total).toBe(680);
    expect(inv.taxable_total).toBeCloseTo(647.62, 2);
    expect(inv.gst_total).toBeCloseTo(32.38, 2);
  });
});

describe("invoice totals", () => {
  it("applies per-line discounts and rounds the grand total transparently", () => {
    const inv = computeInvoice([
      { product_id: "g1", name: "Basmati Rice", unit: "1 kg", quantity: 1, unit_price: 125, discount_pct: 10, gst_rate: 5, tax_inclusive: true },
    ]);
    expect(inv.discount_total).toBeCloseTo(12.5, 2);
    expect(inv.subtotal).toBeCloseTo(112.5, 2);
    expect(inv.grand_total).toBe(113); // rounded from 112.50
    expect(inv.rounding_adjustment).toBeCloseTo(0.5, 2);
  });

  it("computes balance due for a partial payment", () => {
    const inv = computeInvoice(
      [{ product_id: "g2", name: "Sugar 50kg bag", unit: "50 kg", quantity: 1, unit_price: 2721, gst_rate: 5, tax_inclusive: true }],
      { amountPaid: 1000 }
    );
    expect(inv.payment_status).toBe("partial");
    expect(inv.amount_paid).toBe(1000);
    expect(inv.balance_due).toBeCloseTo(inv.grand_total - 1000, 2);
  });

  it("marks unpaid when nothing is paid (credit sale)", () => {
    const inv = computeInvoice(
      [{ product_id: "pc1", name: "Soap", unit: "100 g", quantity: 1, unit_price: 38, gst_rate: 18, tax_inclusive: true }],
      { amountPaid: 0 }
    );
    expect(inv.payment_status).toBe("unpaid");
    expect(inv.balance_due).toBe(inv.grand_total);
  });

  it("totals item count and quantity across lines", () => {
    const inv = computeInvoice([
      { product_id: "g1", name: "Rice", unit: "1 kg", quantity: 3, unit_price: 68, gst_rate: 5, tax_inclusive: true },
      { product_id: "pc1", name: "Soap", unit: "100 g", quantity: 2, unit_price: 38, gst_rate: 18, tax_inclusive: true },
    ]);
    expect(inv.item_count).toBe(2);
    expect(inv.quantity_total).toBe(5);
  });

  it("rejects invalid quantities and discounts", () => {
    expect(validateLine({ product_id: null, name: "Rice", unit: "kg", quantity: 0, unit_price: 10, gst_rate: 5 })).toContain("quantity");
    expect(validateLine({ product_id: null, name: "Rice", unit: "kg", quantity: 1, unit_price: 10, gst_rate: 5, discount_pct: 150 })).toContain("discount");
  });
});

describe("profit and unit conversion", () => {
  it("distinguishes profit amount from margin", () => {
    const { profitAmount, marginPct } = computeProfit(43, 50, 10);
    expect(profitAmount).toBe(70);
    expect(marginPct).toBeCloseTo(14, 2);
  });

  it("converts a 30kg rice bag sale into 30 base units", () => {
    expect(packageToBase(1, 30)).toBe(30);
    expect(packageToBase(2.5, 30)).toBe(75);
  });
});
