// Explicit sample ledger. All displayed metrics are derived from these records.
export const catalogProducts = [
  {
    id: "burger",
    name: "برجر دجاج",
    code: "PR-001",
    group: "وجبات",
    sep: { qty: 400, sales: 12000, cost: 8000 },
    aug: { qty: 350, sales: 10500, cost: 6475 },
    parts: [
      ["المكونات", 17],
      ["التغليف", 3],
    ],
    stocks: ["chicken", "bread", "tomatoes"],
    opportunities: [1],
  },
  {
    id: "pasta",
    name: "باستا الدجاج",
    code: "PR-002",
    group: "وجبات",
    sep: { qty: 200, sales: 8000, cost: 3000 },
    aug: { qty: 180, sales: 7200, cost: 2430 },
    parts: [
      ["المكونات", 13],
      ["التغليف", 2],
    ],
    stocks: ["chicken", "milk"],
    opportunities: [1],
  },
  {
    id: "salad",
    name: "سلطة خضراء",
    code: "PR-003",
    group: "وجبات",
    sep: { qty: 160, sales: 4000, cost: 3500 },
    aug: { qty: 145, sales: 3625, cost: 3000 },
    parts: [
      ["المكونات", 18.875],
      ["التغليف", 3],
    ],
    stocks: ["tomatoes"],
    opportunities: [0],
  },
  {
    id: "espresso",
    name: "قهوة إسبريسو",
    code: "PR-004",
    group: "مشروبات",
    sep: { qty: 600, sales: 12000, cost: 3600 },
    aug: { qty: 550, sales: 11000, cost: 3300 },
    parts: null,
    stocks: null,
    opportunities: [],
  },
  {
    id: "latte",
    name: "لاتيه",
    code: "PR-005",
    group: "مشروبات",
    sep: { qty: 400, sales: 10000, cost: 4800 },
    aug: { qty: 300, sales: 7500, cost: 3400 },
    parts: [
      ["القهوة والحليب", 6],
      ["الكوب والتغليف", 2],
      ["التحضير المباشر", 4],
    ],
    stocks: ["milk", "coffee", "cups"],
    opportunities: [0],
  },
  {
    id: "muffin",
    name: "مافن الشوكولاتة",
    code: "PR-006",
    group: "مخبوزات",
    sep: { qty: 200, sales: 2000, cost: 2300 },
    aug: { qty: 190, sales: 1915, cost: 2100 },
    parts: [
      ["المكونات", 9.5],
      ["التغليف", 2],
    ],
    stocks: ["milk"],
    opportunities: [0],
  },
];
export const catalogStock = [
  {
    id: "chicken",
    name: "دجاج",
    code: "ST-001",
    unit: "كجم",
    cost: 40,
    previousCost: 36.8,
    opening: 80,
    incoming: 200,
    used: 180,
    waste: 0,
    adjustment: 0,
    lead: 5,
    target: 12,
    opportunities: [1],
  },
  {
    id: "tomatoes",
    name: "خضار طازجة",
    code: "ST-002",
    unit: "كجم",
    cost: 10,
    previousCost: 10,
    opening: 60,
    incoming: 180,
    used: 120,
    waste: 80,
    adjustment: 0,
    lead: 2,
    target: 10,
    opportunities: [0],
  },
  {
    id: "milk",
    name: "حليب",
    code: "ST-003",
    unit: "لتر",
    cost: 8,
    previousCost: 7.5,
    opening: 100,
    incoming: 420,
    used: 430,
    waste: 62.5,
    adjustment: 0,
    lead: 3,
    target: 7,
    opportunities: [0],
  },
  {
    id: "bread",
    name: "خبز",
    code: "ST-004",
    unit: "قطعة",
    cost: 3,
    previousCost: 3,
    opening: 120,
    incoming: 600,
    used: 600,
    waste: 100,
    adjustment: 0,
    lead: 2,
    target: 4,
    opportunities: [0],
  },
  {
    id: "cups",
    name: "أكواب ورقية",
    code: "ST-005",
    unit: "قطعة",
    cost: 2,
    previousCost: 2,
    opening: 200,
    incoming: 1000,
    used: 900,
    waste: 0,
    adjustment: 0,
    lead: 4,
    target: 20,
    opportunities: [],
  },
  {
    id: "coffee",
    name: "حبوب قهوة",
    code: "ST-006",
    unit: "كجم",
    cost: 200,
    previousCost: 200,
    opening: 20,
    incoming: 40,
    used: 18,
    waste: 0,
    adjustment: 0,
    lead: 7,
    target: 30,
    opportunities: [],
  },
  {
    id: "syrup",
    name: "شراب منكّه",
    code: "ST-007",
    unit: "زجاجة",
    cost: 30,
    previousCost: 30,
    opening: 30,
    incoming: 0,
    used: 0,
    waste: 0,
    adjustment: 0,
    lead: 7,
    target: 30,
    opportunities: [],
  },
];
export const marginTarget = 20;
export function productMetrics(p, period) {
  const v = p[period];
  const profit = v.cost === null ? null : v.sales - v.cost;
  const margin =
    profit === null || v.sales === 0 ? null : (profit / v.sales) * 100;
  return {
    ...v,
    profit,
    margin,
    unitCost: v.cost === null || !v.qty ? null : v.cost / v.qty,
    status:
      margin === null
        ? "missing"
        : profit < 0
          ? "loss"
          : margin < marginTarget
            ? "low"
            : "normal",
  };
}
export function stockMetrics(p, period) {
  const scale = period === "aug" ? 0.8 : 1,
    days = period === "aug" ? 31 : 30;
  const opening = p.opening * scale,
    incoming = p.incoming * scale,
    used = p.used * scale,
    waste = p.waste * scale,
    adjustment = p.adjustment * scale,
    available = opening + incoming - used - waste + adjustment,
    cost = period === "aug" ? p.previousCost : p.cost,
    daily = used / days,
    coverage = daily > 0 ? available / daily : null;
  return {
    opening,
    incoming,
    used,
    waste,
    adjustment,
    available,
    cost,
    coverage,
    days,
    daily,
    value: available * cost,
    wasteCost: waste * cost,
    excessValue:
      daily > 0 ? Math.max(0, available - daily * p.target) * cost : 0,
    status:
      coverage === null
        ? "slow"
        : coverage < p.lead
          ? "low"
          : coverage > p.target
            ? "excess"
            : waste > 0
              ? "waste"
              : "normal",
  };
}
export function normalizeSearch(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .trim();
}
export function catalogRows(
  tab,
  period,
  {
    query = "",
    status = "all",
    related = null,
    sortKey = null,
    direction = "asc",
  } = {},
) {
  const source = tab === "products" ? catalogProducts : catalogStock,
    metrics = tab === "products" ? productMetrics : stockMetrics;
  const priority =
    tab === "products"
      ? { loss: 0, low: 1, missing: 2, normal: 3 }
      : { low: 0, waste: 1, excess: 2, slow: 3, normal: 4 };
  return source
    .map((p) => ({ ...p, ...metrics(p, period) }))
    .filter(
      (p) =>
        (!query ||
          normalizeSearch(p.name + " " + p.code).includes(
            normalizeSearch(query),
          )) &&
        (status === "all" || p.status === status) &&
        (related === null || p.opportunities.includes(related)),
    )
    .sort((a, b) => {
      if (!sortKey)
        return (
          priority[a.status] - priority[b.status] ||
          a.name.localeCompare(b.name, "ar")
        );
      if (a[sortKey] === null) return b[sortKey] === null ? 0 : 1;
      if (b[sortKey] === null) return -1;
      return (a[sortKey] - b[sortKey]) * (direction === "asc" ? 1 : -1);
    });
}
