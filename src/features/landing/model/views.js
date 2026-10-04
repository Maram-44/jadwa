import {
  catalogProducts,
  catalogStock,
  productMetrics,
  stockMetrics,
} from "../../../shared/data/catalog.js";
import { expenseRecords } from "../../../shared/data/expenses.js";
const number = (value) =>
  new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 1 }).format(value);
const money = (value) => number(value) + " ⃁";
const inventoryLabels = {
  slow: "بطيء الحركة",
  low: "تغطية منخفضة",
  excess: "مخزون زائد",
  waste: "هدر مسجل",
  normal: "ضمن المستهدف",
};
export const views = {
  products: {
    question: "أي صنف يحتاج مراجعة؟",
    description: "شوف هامش كل منتج، وحدّد الأصناف اللي تستحق انتباهك.",
    headings: ["المنتج", "المبيعات", "الهامش", "الحالة"],
    label: "المنتجات",
    footnote: "الهامش قبل المصروفات العامة والهدر المنفصل.",
    href: "products.html?month=sep",
    rows: () =>
      ["salad", "burger", "pasta"].map((id) => {
        const product = catalogProducts.find((item) => item.id === id),
          metric = productMetrics(product, "sep");
        return [
          product.name,
          money(metric.sales),
          number(metric.margin) + "٪",
          {
            text: metric.status === "low" ? "هامش منخفض" : "ضمن المستهدف",
            caution: metric.status !== "normal",
          },
        ];
      }),
  },
  inventory: {
    question: "وش عندك أكثر من حاجتك؟",
    description: "قارن الرصيد بالاستهلاك، وشوف الهدر والتغطية في مكان واحد.",
    headings: ["المادة", "المتاح", "تكلفة الهدر", "الحالة"],
    label: "المخزون",
    footnote: "رصيد نهاية سبتمبر؛ حدود التغطية افتراضية في هذه العينة.",
    href: "products.html?month=sep&tab=inventory",
    rows: () =>
      ["coffee", "milk", "tomatoes"].map((id) => {
        const item = catalogStock.find((item) => item.id === id),
          metric = stockMetrics(item, "sep");
        return [
          item.name,
          number(metric.available) + " " + item.unit,
          money(metric.wasteCost),
          {
            text: inventoryLabels[metric.status],
            caution: metric.status !== "normal",
          },
        ];
      }),
  },
  expenses: {
    question: "أي مصروف يستحق وقفة؟",
    description: "راجع التكاليف المتكررة، وابدأ بالخدمات اللي تتشابه وظائفها.",
    headings: ["المصروف", "المبلغ الشهري", "التكرار", "المراجعة"],
    label: "المصروفات",
    footnote: "تشابه الخدمة يستدعي المراجعة؛ لا يعني أن الاشتراك غير ضروري.",
    href: "expenses.html?month=sep",
    rows: () =>
      ["orders-a", "orders-b", "rent-01"].map((id) => {
        const item = expenseRecords.find((item) => item.id === id);
        return [
          item.name,
          money(item.sep),
          item.recurring ? "متكرر" : "غير متكرر",
          {
            text: item.opportunity === 2 ? "راجع الاستخدام" : "بند تشغيلي",
            caution: item.opportunity === 2,
          },
        ];
      }),
  },
};
