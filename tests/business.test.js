import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { months, opportunities } from "../src/shared/data/demo.js";
import * as catalog from "../src/shared/data/catalog.js";
import * as expenses from "../src/shared/data/expenses.js";
import { HubData } from "../src/features/data-hub/model/csv.js";
import {
  sampleRoomMotion,
  createRoomMotionClock,
} from "../src/features/meeting/renderer/motion.js";
for (const month of ["sep", "aug"]) {
  test("reconciliation " + month, () => {
    const m = months[month],
      r = expenses.expenseReconciliation(month);
    assert.equal(r.total, m.cost);
    assert.equal(m.revenue - m.cost, m.profit);
    assert.equal(
      m.amounts.reduce((a, b) => a + b),
      m.saving,
    );
    assert.equal(
      catalog.catalogRows("products", month).reduce((s, r) => s + r.sales, 0),
      m.revenue,
    );
    assert.equal(
      m.sales.reduce((a, b) => a + b),
      m.revenue,
    );
    assert.equal(
      m.costs.reduce((a, b) => a + b),
      m.cost,
    );
  });
}
for (const type of Object.keys(HubData.schemas)) {
  test("CSV template " + type, () => {
    const parsed = HubData.parse(HubData.template(type)),
      mapping = HubData.suggest(type, parsed.headers),
      result = HubData.validate(
        type,
        parsed,
        mapping,
        new Set(["PR-001", "PR-002"]),
      );
    assert.equal(result.valid.length, 2);
    assert.equal(result.invalid.length, 0);
    assert.equal(result.period, "2026-09");
  });
}
test("CSV escaped quotes, delimiters and multiline values", () => {
  const parsed = HubData.parse(
    'a,b\r\n"x,y","quoted ""value"""\r\n"two\nlines",ok',
  );
  assert.deepEqual(
    parsed.rows.map((r) => r.cells),
    [
      ["x,y", 'quoted "value"'],
      ["two\nlines", "ok"],
    ],
  );
});
test("CSV prevents mixed monthly imports", () => {
  const parsed = HubData.parse(
    "date,product_code,qty,net_sales\n2026-09-01,P1,1,10\n2026-08-01,P1,2,20",
  );
  assert.throws(
    () =>
      HubData.validate(
        "sales",
        parsed,
        HubData.suggest("sales", parsed.headers),
      ),
    /أكثر من شهر/,
  );
});
test("CSV rejects malformed amount", () => {
  const parsed = HubData.parse(
    "date,product_code,qty,net_sales\n2026-09-01,P1,1,wrong",
  );
  const r = HubData.validate(
    "sales",
    parsed,
    HubData.suggest("sales", parsed.headers),
  );
  assert.equal(r.valid.length, 0);
  assert.equal(r.invalid.length, 1);
});
test("Arabic search and related inventory selection", () => {
  assert.equal(
    catalog.catalogRows("inventory", "sep", { query: "قهوة" }).length,
    1,
  );
  assert.ok(
    catalog
      .catalogRows("products", "sep", { related: 1 })
      .every((r) => r.opportunities.includes(1)),
  );
});
test("motion clock freezes hidden time and disabled pose", () => {
  const c = createRoomMotionClock(true);
  c.sample(0);
  const p = c.sample(100);
  c.suspend();
  assert.deepEqual(c.sample(100000), p);
  c.setEnabled(false);
  assert.deepEqual(c.sample(200000), p);
  c.setEnabled(false, true);
  assert.deepEqual(c.sample(200100), sampleRoomMotion(0, false));
});
test("greeting ends and blink remains bounded", () => {
  for (const t of [0, 0.35, 1.25, 2, 2.45, 4.8, 10.2, 23.7, 90]) {
    const p = sampleRoomMotion(t);
    assert.ok(p.head.every(Number.isFinite));
    assert.ok(p.head[2] >= 0 && p.head[2] <= 1);
  }
  assert.deepEqual(sampleRoomMotion(5).arm, sampleRoomMotion(30).arm);
});
