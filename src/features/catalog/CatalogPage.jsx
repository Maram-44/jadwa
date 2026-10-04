import { useState, useEffect, useRef } from "react";
import View from "./components/ProductsView.jsx";
import CatalogDetails, { labels } from "./components/CatalogDetails.jsx";
import { months, opportunities } from "../../shared/data/demo.js";
import {
  catalogProducts,
  catalogStock,
  catalogRows,
  marginTarget,
} from "../../shared/data/catalog.js";
import { useQuery, useLoading, useWorkspace } from "../../shared/lib/hooks.js";
import { Summary, Money, number, Icon } from "../../shared/ui/primitives.jsx";
import DataTable from "../../shared/ui/DataTable.jsx";
import InfoContent from "../../shared/ui/InfoContent.jsx";
export default function CatalogPage() {
  const [params, update] = useQuery(),
    month = Object.hasOwn(months, params.get("month"))
      ? params.get("month")
      : "sep",
    tab = params.get("tab") === "inventory" ? "inventory" : "products",
    related = ["0", "1"].includes(params.get("opportunity"))
      ? Number(params.get("opportunity"))
      : null;
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [sortKey, setSort] = useState(null),
    [direction, setDirection] = useState("asc"),
    [item, setItem] = useState(null);
  const loading = useLoading(month + tab, 500),
    w = useWorkspace(month, "catalog"),
    productTab = useRef(),
    stockTab = useRef();
  const source = tab === "products" ? catalogProducts : catalogStock,
    full = catalogRows(tab, month),
    rows = catalogRows(tab, month, {
      query,
      status,
      related,
      sortKey,
      direction,
    });
  const headers =
    tab === "products"
      ? [
          ["المنتج", null],
          ["الوحدات المباعة", "qty"],
          ["المبيعات", "sales"],
          ["تكلفة المبيعات", "cost"],
          ["الربح الإجمالي", "profit"],
          ["الهامش", "margin"],
          ["الحالة", null],
        ]
      : [
          ["الصنف", null],
          ["المتاح", "available"],
          ["الاستهلاك", "used"],
          ["التغطية", "coverage"],
          ["تكلفة الهدر", "wasteCost"],
          ["الحالة", null],
        ];
  useEffect(() => {
    if (!loading && params.get("item"))
      setItem(source.find((x) => x.id === params.get("item")) || null);
  }, [loading]);
  const reset = () => {
    setQuery("");
    setStatus("all");
    setSort(null);
    setDirection("asc");
    update({ opportunity: null, item: null });
  };
  const switchTab = (next, focus = false) => {
    if (next !== tab) {
      setQuery("");
      setStatus("all");
      setSort(null);
      setDirection("asc");
      update({ tab: next, item: null });
    }
    if (focus) (next === "products" ? productTab : stockTab).current?.focus();
  };
  const sort = (k) => {
    setDirection(sortKey === k && direction === "asc" ? "desc" : "asc");
    setSort(k);
  };
  const sales = full.reduce((s, p) => s + (p.sales || 0), 0),
    costs = full.reduce((s, p) => s + (p.cost ?? 0), 0),
    margin =
      sales && full.every((p) => p.cost !== null)
        ? ((sales - costs) / sales) * 100
        : null;
  const summaries =
    tab === "products"
      ? [
          [
            "chart",
            "مبيعات المنتجات",
            <Money value={sales} />,
            "متطابقة مع مبيعات الرئيسية",
          ],
          [
            "trend",
            "هامش الربح الإجمالي",
            margin === null ? "—" : number(margin) + "٪",
            "قبل المصروفات العامة والهدر المنفصل",
          ],
          [
            "info",
            "أصناف تحتاج مراجعة",
            number(full.filter((p) => p.status !== "normal").length),
            "المستهدف الافتراضي للهامش: ٢٠٪",
          ],
        ]
      : [
          [
            "box",
            "قيمة المخزون المتاح",
            <Money value={full.reduce((s, p) => s + p.value, 0)} />,
            "بسعر التكلفة في نهاية الفترة",
          ],
          [
            "wallet",
            "تكلفة الهدر",
            <Money value={full.reduce((s, p) => s + p.wasteCost, 0)} />,
            "هدر مسجل خلال الفترة المختارة",
          ],
          [
            "info",
            "أصناف تحتاج انتباهًا",
            number(full.filter((p) => p.status !== "normal").length),
            "زيادة، قرب نفاد، هدر أو حركة بطيئة",
          ],
        ];
  const cells = rows.map((p) => ({
    id: p.id,
    cells: [
      <>
        <button
          className="product-name"
          data-item={p.id}
          onClick={() => {
            setItem(source.find((x) => x.id === p.id));
            w.closeMenu();
          }}
        >
          {p.name}
        </button>
        <span className="product-code">{p.code}</span>
      </>,
      ...(tab === "products"
        ? [
            number(p.qty),
            <span className="cell-money">
              <Money value={p.sales} />
            </span>,
            <span className="cell-money">
              <Money value={p.cost} />
            </span>,
            <span
              className={
                "cell-money " + (p.profit < 0 ? "negative-number" : "")
              }
            >
              <Money value={p.profit} />
            </span>,
            <span
              className={
                p.margin < 0
                  ? "negative-number"
                  : p.margin >= marginTarget
                    ? "healthy-number"
                    : ""
              }
            >
              {p.margin === null ? "—" : number(p.margin) + "٪"}
            </span>,
          ]
        : [
            <>
              {number(p.available)}{" "}
              <small className="cell-unit">{p.unit}</small>
            </>,
            <>
              {number(p.used)} <small className="cell-unit">{p.unit}</small>
            </>,
            p.coverage === null ? (
              <span title="لا يوجد استهلاك خلال الفترة">غير متاحة</span>
            ) : (
              number(p.coverage) + " يوم"
            ),
            <span className="cell-money">
              <Money value={p.wasteCost} />
            </span>,
          ]),
      <span className={"catalog-status " + p.status}>
        {labels[tab][p.status]}
      </span>,
    ],
  }));
  const slots = {
    "catalog-summary": summaries.map(([icon, title, value, note], i) => (
      <Summary
        key={title}
        {...{ icon, title, value, note, loading }}
        featured={i === 0}
      />
    )),
    "catalog-scope": (
      <>
        <Icon name="info" />
        {tab === "products"
          ? "هامش الربح الإجمالي محسوب من مجموع المبيعات والتكاليف. الهدر يُعرض منفصلًا ولا يُحتسب مرتين."
          : "الأرصدة لقطة في نهاية الفترة المختارة، والتغطية تقدير يعتمد على معدل الاستهلاك ومدة التوريد."}
      </>
    ),
    "catalog-basis":
      tab === "products"
        ? "الهامش المستهدف: ٢٠٪ · افتراض الديمو"
        : "المتاح في نهاية " + months[month].name,
    "catalog-footnote":
      tab === "products"
        ? "تكلفة المبيعات هنا تخص الوحدات المباعة فقط. انخفاض الهامش لا يعني خسارة، وصافي ربح المنشأة يشمل مصروفات أخرى."
        : "المخزون الزائد مال مجمّد، وليس خسارة محققة. تقدير التغطية لا يتنبأ بتغيّر الطلب، وحدود التوريد افتراضية في هذه النسخة.",
    "related-banner":
      related !== null ? (
        <>
          <span>أصناف مرتبطة بفرصة «{opportunities[related].title}»</span>
          <button onClick={() => update({ opportunity: null })}>
            إزالة التصفية
          </button>
        </>
      ) : null,
    "period-footer": "نسخة تجريبية · " + months[month].name + " ٢٠٢٦",
    "catalog-count":
      number(rows.length) + " من " + number(source.length) + " أصناف",
    "catalog-table": (
      <DataTable
        {...{ headers, loading, sortKey, direction }}
        rows={cells}
        onSort={sort}
      />
    ),
    "catalog-message": (
      <>
        <Icon name="box" />
        <h3>لا توجد نتائج مطابقة</h3>
        <p>جرّبي كلمة بحث أخرى أو أزيلي الفلاتر للوصول إلى أصنافك.</p>
        <button className="primary-button" onClick={reset}>
          مسح الفلاتر
        </button>
      </>
    ),
    "status-filter": (
      <>
        <option value="all">كل الحالات</option>
        {Object.entries(labels[tab]).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </>
    ),
    "catalog-sort": (
      <>
        <option value="attention">يحتاج انتباهًا أولًا</option>
        {headers
          .filter((x) => x[1])
          .flatMap(([name, key]) => [
            <option key={key + "desc"} value={key + ":desc"}>
              {name}: الأعلى
            </option>,
            <option key={key + "asc"} value={key + ":asc"}>
              {name}: الأقل
            </option>,
          ])}
      </>
    ),
    "sheet-caption": tab === "products" ? "تفاصيل المنتج" : "تفاصيل المخزون",
    "sheet-content": <CatalogDetails {...{ item, tab, month }} />,
    "dialog-content": (
      <InfoContent info={w.info} close={() => w.setInfo(null)} />
    ),
    "loading-status": loading
      ? "جاري تحميل بيانات " + (tab === "products" ? "المنتجات" : "المخزون")
      : number(rows.length) + " نتائج",
  };
  return (
    <View
      active="catalog"
      slots={slots}
      refs={{
        ...w.refs,
        "products-tab": productTab,
        "inventory-tab": stockTab,
      }}
      bindings={{
        ...w.bindings,
        period: {
          value: month,
          onChange: (e) => update({ month: e.target.value, item: null }),
        },
        "catalog-panel": {
          "aria-labelledby": tab + "-tab",
          "aria-busy": loading,
        },
        ".catalog-toolbar": { inert: loading },
        "catalog-table": { hidden: !loading && !rows.length, inert: loading },
        "catalog-message": { hidden: loading || !!rows.length },
        "related-banner": { hidden: related === null },
        "catalog-search": {
          value: query,
          placeholder:
            tab === "products"
              ? "ابحث باسم المنتج أو رمزه…"
              : "ابحث باسم المادة أو رمزها…",
          onChange: (e) => setQuery(e.target.value),
        },
        "status-filter": {
          value: status,
          onChange: (e) => setStatus(e.target.value),
        },
        "catalog-sort": {
          value: sortKey ? sortKey + ":" + direction : "attention",
          onChange: (e) => {
            const [k, d] = e.target.value.split(":");
            setSort(k === "attention" ? null : k);
            setDirection(d || "asc");
          },
        },
        "clear-filters": { onClick: reset },
        ...Object.fromEntries(
          ["products", "inventory"].map((t) => [
            "data-tab:" + t,
            {
              "aria-selected": tab === t,
              tabIndex: tab === t ? 0 : -1,
              onClick: () => switchTab(t),
            },
          ]),
        ),
        ".catalog-tabs": {
          onKeyDown: (e) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              switchTab(
                e.key === "Home"
                  ? "products"
                  : e.key === "End"
                    ? "inventory"
                    : tab === "products"
                      ? "inventory"
                      : "products",
                true,
              );
            }
          },
        },
        "catalog-dialog": { open: !!item, onClose: () => setItem(null) },
        "close-sheet": { onClick: () => setItem(null) },
        "advisor-button": {
          onClick: () =>
            w.setInfo({
              title: "اسأل جدوى",
              text: "المساعد غير متصل بنموذج ذكاء اصطناعي بعد. يمكنك مراجعة تفاصيل الصنف وفرص التحسين المرتبطة به لفهم الأرقام الحالية.",
            }),
        },
      }}
    />
  );
}
