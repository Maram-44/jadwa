import { useState, useEffect } from "react";
import View from "./components/ExpensesView.jsx";
import ExpenseDetails, { categoryName } from "./components/ExpenseDetails.jsx";
import { months } from "../../shared/data/demo.js";
import {
  expenseRows,
  expenseSummary,
  expenseCategories,
  expenseReconciliation,
} from "../../shared/data/expenses.js";
import { useQuery, useLoading, useWorkspace } from "../../shared/lib/hooks.js";
import { Summary, Money, number, Icon } from "../../shared/ui/primitives.jsx";
import DataTable from "../../shared/ui/DataTable.jsx";
import InfoContent from "../../shared/ui/InfoContent.jsx";
export default function ExpensesPage() {
  const [params, update] = useQuery(),
    month = Object.hasOwn(months, params.get("month"))
      ? params.get("month")
      : "sep",
    related = params.get("opportunity") === "2",
    w = useWorkspace(month, "expenses"),
    loading = useLoading(month, 500);
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [recurrence, setRecurrence] = useState("all"),
    [sort, setSort] = useState("date-desc"),
    [item, setItem] = useState(null);
  const list = expenseRows(month, {
      query,
      category,
      recurrence,
      sort,
      related,
    }),
    all = expenseRows(month),
    s = expenseSummary(month),
    c = s.comparison,
    m = months[month],
    max = Math.max(1, ...s.categories.map((c) => c.total));
  useEffect(() => {
    if (!loading && params.get("item"))
      setItem(all.find((r) => r.id === params.get("item")) || null);
  }, [loading]);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setRecurrence("all");
    setSort("date-desc");
    update({ opportunity: null, item: null });
  };
  const breakdown = () => {
    const r = expenseReconciliation(month);
    w.setInfo({
      title: "كيف تُحسب إجمالي التكاليف؟",
      content: (
        <>
          <p className="dialog-description">
            تفصيل {m.name} ٢٠٢٦، متسق مع الرئيسية وصفحة المنتجات والمخزون.
          </p>
          <table className="ledger">
            <tbody>
              {[
                ["تكلفة الوحدات المباعة", r.products],
                ["الهدر المسجل منفصلًا", r.waste],
                ["المصروفات التشغيلية", r.operating],
              ].map(([label, n]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>
                    <Money value={n} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="reconcile-total">
            <span>إجمالي التكاليف</span>
            <strong>
              <Money value={r.total} />
            </strong>
          </div>
          <p className="dialog-description">
            شراء المخزون لا يُضاف مرة ثانية إلى المصروفات التشغيلية. المبالغ في
            هذا المثال غير شاملة الضريبة.
          </p>
        </>
      ),
    });
  };
  const headers = [
      ["البند", null],
      ["التصنيف", null],
      ["الجهة", null],
      ["التاريخ", "date"],
      ["المبلغ", "amount"],
      ["التكرار", null],
    ],
    cells = list.map((r) => ({
      id: r.id,
      cells: [
        <>
          <button
            className="product-name"
            data-item={r.id}
            onClick={() => {
              setItem(r);
              w.closeMenu();
            }}
          >
            {r.name}
          </button>
          <span className="expense-reference">
            {r.opportunity !== null ? (
              <>
                <Icon name="info" />
                مرتبط بفرصة تحسين
              </>
            ) : (
              "مصروف تشغيلي"
            )}
          </span>
        </>,
        categoryName(r.category),
        r.vendor,
        <span className="expense-date">
          {number(r.day)} {m.name}
        </span>,
        <span className="cell-money">
          <Money value={r.amount} />
        </span>,
        <span className={"recurrence-badge " + (r.recurring ? "" : "one-off")}>
          {r.recurring ? "شهري" : "غير متكرر"}
        </span>,
      ],
    }));
  const change = c
    ? c.difference === 0
      ? "لم يتغير الإجمالي"
      : (c.difference < 0 ? "انخفاض" : "ارتفاع") +
        " " +
        (c.percentage === null ? "" : number(Math.abs(c.percentage)) + "٪") +
        " عن أغسطس"
    : "لا تتوفر بيانات يوليو للمقارنة";
  const slots = {
    "expense-summary": (
      <>
        <Summary
          icon="wallet"
          title="المصروفات التشغيلية"
          value={<Money value={s.total} />}
          note={m.name + " ٢٠٢٦"}
          featured
          loading={loading}
        />
        <Summary
          icon="trend"
          title="التغير عن الشهر السابق"
          value={c ? <Money value={Math.abs(c.difference)} /> : "—"}
          note={change}
          loading={loading}
        />
        <Summary
          icon="calendar"
          title="مصروفات متكررة"
          value={<Money value={s.recurringTotal} />}
          note={number(s.recurringCount) + " بنود شهرية في الفترة"}
          loading={loading}
        />
      </>
    ),
    "distribution-period": m.name + " ٢٠٢٦",
    "period-footer": "نسخة تجريبية · " + m.name + " ٢٠٢٦",
    "expense-bars": s.categories
      .filter((c) => c.total > 0)
      .map((c) => (
        <button
          key={c.id}
          className="distribution-row"
          data-category={c.id}
          aria-pressed={category === c.id}
          style={{
            "--category-color": c.color,
            "--bar-width": (c.total / max) * 100 + "%",
          }}
          aria-label={
            "تصفية " + c.name + ": " + number(c.total) + " ريال سعودي"
          }
          onClick={() => setCategory(category === c.id ? "all" : c.id)}
        >
          <span className="distribution-label">{c.name}</span>
          <span className="distribution-track" aria-hidden="true">
            <span className="distribution-fill" />
          </span>
          <span className="distribution-amount">
            <Money value={c.total} />
          </span>
          <span className="distribution-share">
            {number(s.total ? (c.total / s.total) * 100 : 0)}٪
          </span>
        </button>
      )),
    "expense-count":
      number(list.length) + " من " + number(all.length) + " بنود",
    "filtered-total": (
      <>
        مجموع النتائج: <Money value={list.reduce((s, r) => s + r.amount, 0)} />
      </>
    ),
    "related-banner": (
      <>
        <span>مصروفات مرتبطة بفرصة «راجع الاشتراكات المتكررة»</span>
        <button onClick={() => update({ opportunity: null })}>
          إزالة التصفية
        </button>
      </>
    ),
    "expense-table": (
      <DataTable
        {...{ headers, loading }}
        rows={cells}
        className="catalog-table expenses-table"
        sortKey={sort.split("-")[0]}
        direction={sort.split("-")[1]}
        onSort={(key) =>
          setSort(key + "-" + (sort === key + "-asc" ? "desc" : "asc"))
        }
      />
    ),
    "catalog-message": (
      <>
        <Icon name="wallet" />
        <h3>لا توجد نتائج مطابقة</h3>
        <p>جرّبي تغيير البحث أو إزالة الفلاتر.</p>
        <button className="primary-button" onClick={reset}>
          مسح الفلاتر
        </button>
      </>
    ),
    "expense-category": (
      <>
        <option value="all">كل التصنيفات</option>
        {expenseCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </>
    ),
    "sheet-content": <ExpenseDetails {...{ item, month }} />,
    "dialog-content": (
      <InfoContent info={w.info} onClose={() => w.setInfo(null)} />
    ),
    "loading-status": loading
      ? "جاري تحميل مصروفات " + m.name
      : number(list.length) + " نتائج",
  };
  return (
    <View
      active="expenses"
      slots={slots}
      refs={w.refs}
      bindings={{
        ...w.bindings,
        period: {
          value: month,
          onChange: (e) => update({ month: e.target.value, item: null }),
        },
        "expense-table": {
          hidden: !loading && !list.length,
          inert: loading,
          "aria-busy": loading,
        },
        "catalog-message": { hidden: loading || !!list.length },
        ".catalog-toolbar": { inert: loading },
        "expense-bars": { inert: loading },
        "related-banner": { hidden: !related },
        "expense-search": {
          value: query,
          onChange: (e) => setQuery(e.target.value),
        },
        "expense-category": {
          value: category,
          onChange: (e) => setCategory(e.target.value),
        },
        "expense-recurrence": {
          value: recurrence,
          onChange: (e) => setRecurrence(e.target.value),
        },
        "expense-sort": {
          value: sort,
          onChange: (e) => setSort(e.target.value),
        },
        "clear-filters": { onClick: reset },
        "cost-breakdown": { onClick: breakdown },
        "expense-dialog": { open: !!item, onClose: () => setItem(null) },
        "close-sheet": { onClick: () => setItem(null) },
        "advisor-button": {
          onClick: () =>
            w.setInfo({
              title: "اسأل جدوى",
              text: "المساعد غير متصل بنموذج ذكاء اصطناعي بعد. افتحي تفاصيل البند لمعرفة مصدره، والمقارنة، وفرصة التحسين المرتبطة به.",
            }),
        },
      }}
    />
  );
}
