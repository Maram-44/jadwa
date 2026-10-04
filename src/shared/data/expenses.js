import {
  normalizeSearch,
  catalogProducts,
  catalogStock,
  stockMetrics,
} from "./catalog.js";
import { months } from "./demo.js";
// Operating costs only: excludes product cost of sales and separately recorded waste.
export const expenseCategories = [
  { id: "rent", name: "الإيجار", color: "#2563eb" },
  { id: "payroll", name: "الرواتب التشغيلية", color: "#06b6d4" },
  { id: "utilities", name: "الخدمات", color: "#34b88e" },
  { id: "software", name: "الاشتراكات والبرمجيات", color: "#e3b130" },
  { id: "marketing", name: "التسويق", color: "#f28a75" },
  { id: "unclassified", name: "غير مصنف", color: "#94a3b8" },
];
export const expenseRecords = [
  {
    id: "rent-01",
    name: "إيجار المحل",
    category: "rent",
    vendor: "الجهة المؤجرة",
    recurring: true,
    day: 1,
    sep: 3500,
    aug: 3500,
    opportunity: null,
    description: "إيجار مساحة المحل عن شهر واحد. مسجل ضمن التشغيل فقط.",
  },
  {
    id: "payroll-01",
    name: "رواتب الإدارة والتشغيل",
    category: "payroll",
    vendor: "فريق التشغيل",
    recurring: true,
    day: 28,
    sep: 3000,
    aug: 4000,
    opportunity: null,
    description:
      "رواتب تشغيلية غير محملة على تكلفة المنتج. تكلفة التحضير المباشر المحتسبة في المنتجات مستبعدة من هذا البند.",
  },
  {
    id: "electricity-01",
    name: "استهلاك الكهرباء",
    category: "utilities",
    vendor: "مقدم خدمات الكهرباء",
    recurring: true,
    day: 8,
    sep: 650,
    aug: 1200,
    opportunity: null,
    description:
      "تكلفة الكهرباء المسجلة للفترة. انخفاض المبلغ وحده لا يثبت تحسن الكفاءة؛ يلزم مراجعة الاستهلاك والتعرفة والفترة.",
  },
  {
    id: "water-01",
    name: "استهلاك المياه",
    category: "utilities",
    vendor: "مقدم خدمات المياه",
    recurring: true,
    day: 9,
    sep: 350,
    aug: 500,
    opportunity: null,
    description: "تكلفة المياه الخاصة بالتشغيل خلال الشهر المحدد.",
  },
  {
    id: "orders-a",
    name: "اشتراك إدارة الطلبات أ",
    category: "software",
    vendor: "مقدم الخدمة أ",
    recurring: true,
    day: 12,
    sep: 500,
    aug: 450,
    opportunity: 2,
    renewDay: 12,
    description:
      "اشتراك شهري لإدارة الطلبات. توجد خدمة أخرى بوظيفة مشابهة؛ تأكدي من استخدام الفريق وشروط الإلغاء قبل اتخاذ قرار.",
  },
  {
    id: "orders-b",
    name: "اشتراك إدارة الطلبات ب",
    category: "software",
    vendor: "مقدم الخدمة ب",
    recurring: true,
    day: 18,
    sep: 400,
    aug: 400,
    opportunity: 2,
    renewDay: 18,
    description:
      "اشتراك شهري إضافي لإدارة الطلبات. التشابه مع الخدمة أ يستدعي المراجعة، ولا يعني أن الاشتراك غير ضروري.",
  },
  {
    id: "campaign-01",
    name: "حملة إعلانية شهرية",
    category: "marketing",
    vendor: "منصة الإعلانات",
    recurring: false,
    day: 22,
    sep: 800,
    aug: 1323,
    opportunity: null,
    description:
      "إنفاق إعلاني غير ملزم بالتجديد. تكرار الحملات في شهرين لا يعني وجود اشتراك أو التزام دوري.",
  },
];
export function expensePeriodNumber(period) {
  return period === "aug" ? "08" : "09";
}
export function expenseDate(record, period) {
  return `2026-${expensePeriodNumber(period)}-${String(record.day).padStart(2, "0")}`;
}
export function expenseComparison(current, previous) {
  if (previous === null || previous === undefined) return null;
  return {
    difference: current - previous,
    percentage: previous === 0 ? null : ((current - previous) / previous) * 100,
  };
}
export function expenseRows(
  period,
  {
    query = "",
    category = "all",
    recurrence = "all",
    related = false,
    sort = "date-desc",
  } = {},
) {
  const q = normalizeSearch(query);
  return expenseRecords
    .filter((r) => r[period] !== null && r[period] !== undefined)
    .map((r, i) => ({
      ...r,
      category: expenseCategories.some((c) => c.id === r.category)
        ? r.category
        : "unclassified",
      amount: r[period],
      date: expenseDate(r, period),
      sourceRow: expenseRecords.indexOf(r) + 2,
    }))
    .filter(
      (r) =>
        (!q || normalizeSearch(r.name + " " + r.vendor).includes(q)) &&
        (category === "all" || r.category === category) &&
        (recurrence === "all" ||
          r.recurring === (recurrence === "recurring")) &&
        (!related || r.opportunity === 2),
    )
    .sort((a, b) =>
      sort.startsWith("amount")
        ? (a.amount - b.amount) * (sort.endsWith("asc") ? 1 : -1)
        : a.date.localeCompare(b.date) * (sort.endsWith("asc") ? 1 : -1),
    );
}
export function expenseSummary(period) {
  const rows = expenseRows(period),
    previous = period === "sep" ? expenseRows("aug") : null,
    total = rows.reduce((s, r) => s + r.amount, 0);
  return {
    total,
    comparison: expenseComparison(
      total,
      previous ? previous.reduce((s, r) => s + r.amount, 0) : null,
    ),
    recurringTotal: rows
      .filter((r) => r.recurring)
      .reduce((s, r) => s + r.amount, 0),
    recurringCount: rows.filter((r) => r.recurring).length,
    categories: expenseCategories.map((c) => ({
      ...c,
      total: rows
        .filter((r) => r.category === c.id)
        .reduce((s, r) => s + r.amount, 0),
    })),
  };
}
export function expenseReconciliation(period) {
  return {
    products: catalogProducts.reduce((s, p) => s + p[period].cost, 0),
    waste: catalogStock.reduce(
      (s, p) => s + stockMetrics(p, period).wasteCost,
      0,
    ),
    operating: expenseSummary(period).total,
    total: months[period].cost,
  };
}
