import { months } from "../../../shared/data/demo.js";
import {
  catalogProducts,
  catalogStock,
  productMetrics,
  stockMetrics,
} from "../../../shared/data/catalog.js";
import {
  Money,
  number,
  Stat,
  Related,
} from "../../../shared/ui/primitives.jsx";
export const labels = {
  products: {
    normal: "ضمن المستهدف",
    low: "هامش منخفض",
    loss: "خاسر",
    missing: "بيانات ناقصة",
  },
  inventory: {
    normal: "ضمن الاحتياج",
    low: "قريب من النفاد",
    excess: "مخزون زائد",
    slow: "حركة بطيئة",
    waste: "هدر مسجل",
  },
};
function Block({ title, children }) {
  return (
    <section className="evidence-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
export default function CatalogDetails({ item, tab, month }) {
  if (!item) return null;
  const m = months[month],
    p =
      tab === "products"
        ? productMetrics(item, month)
        : stockMetrics(item, month),
    prev =
      tab === "products" && month === "sep"
        ? productMetrics(item, "aug")
        : null,
    relatedProducts = catalogProducts.filter((x) =>
      x.stocks?.includes(item.id),
    );
  const descriptions = {
    low: (
      <>
        التغطية {number(p.coverage)} يوم، أقل من مدة التوريد المفترضة{" "}
        {number(item.lead)} أيام. راجعي الاحتياج وموعد التوريد قبل نفاد المادة.
      </>
    ),
    excess: (
      <>
        التغطية {number(p.coverage)} يوم، أعلى من الحد المستهدف{" "}
        {number(item.target)} يومًا. قيمة الزيادة التقديرية{" "}
        <Money value={p.excessValue} />؛ هذا مخزون قابل للاستخدام وليس خسارة.
      </>
    ),
    slow: "لا يوجد استهلاك مسجل خلال الفترة، لذلك لا يمكن حساب تغطية بالأيام. راجعي الحاجة لهذا المخزون وصلاحيته.",
    waste: (
      <>
        سُجل هدر بقيمة <Money value={p.wasteCost} /> خلال الفترة. راجعي أسباب
        التلف وكميات الشراء قبل تعديلها.
      </>
    ),
    normal: "التغطية ضمن حدود التوريد والمخزون المفترضة في هذا المثال.",
  };
  return (
    <>
      <span className={"catalog-status " + p.status}>
        {labels[tab][p.status]}
      </span>
      <h2 id="sheet-title">{item.name}</h2>
      <p className="sheet-period">
        {item.code} · {tab === "inventory" ? "رصيد نهاية " : ""}
        {m.name} ٢٠٢٦
      </p>
      {tab === "products" ? (
        <>
          <div className="detail-stats">
            <Stat label="المبيعات" value={<Money value={p.sales} />} />
            <Stat
              label="تكلفة الوحدات المباعة"
              value={<Money value={p.cost} />}
            />
            <Stat label="الربح الإجمالي" value={<Money value={p.profit} />} />
            <Stat
              label="هامش الربح"
              value={p.margin === null ? "—" : number(p.margin) + "٪"}
              note="المستهدف الافتراضي: ٢٠٪"
            />
          </div>
          <Block title="مقارنة بالفترة السابقة">
            <p>
              {prev ? (
                <>
                  الوحدات المباعة: {number(prev.qty)} ← {number(p.qty)}. تكلفة
                  الوحدة: <Money value={prev.unitCost} /> ←{" "}
                  <Money value={p.unitCost} />.{" "}
                  {p.unitCost > prev.unitCost
                    ? "ارتفعت تكلفة الوحدة مقارنة بأغسطس."
                    : p.unitCost < prev.unitCost
                      ? "انخفضت تكلفة الوحدة مقارنة بأغسطس."
                      : "لم تتغير تكلفة الوحدة."}
                </>
              ) : (
                "لا تتوفر بيانات يوليو للمقارنة في هذا المثال."
              )}
            </p>
          </Block>
          <Block title="تفصيل تكلفة الوحدة">
            {item.parts ? (
              <table className="ledger">
                <tbody>
                  {item.parts.map(([name, value]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>
                        <Money
                          value={
                            (value / item.parts.reduce((s, x) => s + x[1], 0)) *
                            p.unitCost
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="ledger-total">
                    <td>إجمالي تكلفة الوحدة</td>
                    <td>
                      <Money value={p.unitCost} />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="detail-empty">
                التكلفة الإجمالية متاحة، لكن لا توجد تفاصيل مكونات أو وصفة مسجلة
                لهذا المنتج.
              </p>
            )}
            <p className="sheet-disclaimer">
              التكاليف عينة توضيحية للوحدات المباعة. الهدر المنفصل غير مضاف هنا.
            </p>
          </Block>
          <Block title="مواد المخزون المرتبطة">
            {item.stocks ? (
              <div className="linked-items">
                {item.stocks.map((id) => (
                  <a
                    key={id}
                    className="linked-item"
                    href={
                      "products.html?month=" +
                      month +
                      "&tab=inventory&item=" +
                      id
                    }
                  >
                    {catalogStock.find((s) => s.id === id).name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="detail-empty">
                لا تتوفر بيانات الربط بالمخزون لهذا المنتج.
              </p>
            )}
          </Block>
        </>
      ) : (
        <>
          <div className="detail-stats">
            <Stat
              label="الكمية المتاحة"
              value={number(p.available)}
              note={item.unit}
            />
            <Stat label="قيمة المخزون" value={<Money value={p.value} />} />
            <Stat
              label="تغطية تقديرية"
              value={p.coverage === null ? "غير متاحة" : number(p.coverage)}
              note="يوم"
            />
            <Stat label="تكلفة الهدر" value={<Money value={p.wasteCost} />} />
          </div>
          <Block title="ما الذي يحتاج انتباهك؟">
            <p>{descriptions[p.status]}</p>
          </Block>
          <Block title={"حركة الفترة · " + item.unit}>
            <table className="ledger">
              <tbody>
                {[
                  ["رصيد البداية", p.opening],
                  ["الوارد خلال الفترة", p.incoming],
                  ["المستهلك", p.used],
                  ["الهدر", p.waste],
                  ["التسويات", p.adjustment],
                  ["رصيد نهاية الفترة", p.available],
                ].map(([label, value], i) => (
                  <tr key={label} className={i === 5 ? "ledger-total" : ""}>
                    <td>{label}</td>
                    <td>{number(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="sheet-disclaimer">
              رصيد البداية + الوارد − المستهلك − الهدر + التسويات = رصيد
              النهاية.
            </p>
          </Block>
          <Block title="أساس التقدير">
            <p>
              تكلفة الوحدة: <Money value={p.cost} />. متوسط الاستهلاك اليومي:{" "}
              {number(p.daily)} {item.unit}. مدة التوريد: {number(item.lead)}{" "}
              أيام؛ الحد المستهدف: {number(item.target)} يومًا.
            </p>
            <p className="sheet-disclaimer">
              التغطية = المتاح ÷ متوسط الاستهلاك اليومي، على {number(p.days)}{" "}
              يومًا. الحدود افتراضية وليست توقعًا مضمونًا للطلب.
            </p>
          </Block>
          <Block title="منتجات تستخدم هذه المادة">
            {relatedProducts.length ? (
              <div className="linked-items">
                {relatedProducts.map((x) => (
                  <a
                    key={x.id}
                    className="linked-item"
                    href={
                      "products.html?month=" +
                      month +
                      "&tab=products&item=" +
                      x.id
                    }
                  >
                    {x.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="detail-empty">
                لا تتوفر منتجات مرتبطة بهذه المادة في بيانات الوصفات الحالية.
              </p>
            )}
          </Block>
        </>
      )}
      <Block title="فرص التحسين المرتبطة">
        <Related ids={item.opportunities} month={month} />
      </Block>
      <p className="sheet-disclaimer">
        جميع البيانات توضيحية. هذه الصفحة للاستعراض والتحليل ولا تعدّل الأسعار
        أو أرصدة المخزون.
      </p>
    </>
  );
}
