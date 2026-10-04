import {
  expenseCategories,
  expenseComparison,
} from "../../../shared/data/expenses.js";
import { months } from "../../../shared/data/demo.js";
import { Money, number, Icon } from "../../../shared/ui/primitives.jsx";
export const categoryName = (id) =>
  expenseCategories.find((c) => c.id === id)?.name || "غير مصنف";
export default function ExpenseDetails({ item: r, month }) {
  if (!r) return null;
  const c = expenseComparison(r.amount, month === "sep" ? r.aug : null),
    m = months[month],
    renewal = r.renewDay
      ? number(r.renewDay) +
        " " +
        (month === "sep" ? "أكتوبر" : "سبتمبر") +
        " ٢٠٢٦"
      : "غير متوفر في البيانات";
  const comparison = !c ? (
    "لا تتوفر بيانات يوليو للمقارنة."
  ) : c.difference === 0 ? (
    "لم يتغير مبلغ هذا البند مقارنة بأغسطس."
  ) : (
    <>
      {c.difference < 0 ? "انخفض" : "ارتفع"} مبلغ البند{" "}
      <Money value={Math.abs(c.difference)} />
      {c.percentage === null
        ? " (لا تتوفر نسبة مقارنة مع مبلغ سابق يساوي صفرًا)"
        : "، بنسبة " + number(Math.abs(c.percentage)) + "٪"}{" "}
      مقارنة بأغسطس.
    </>
  );
  return (
    <>
      <span className="sheet-category">
        <Icon name="wallet" />
        {categoryName(r.category)}
      </span>
      <h2 id="sheet-title">{r.name}</h2>
      <p className="sheet-period">{m.name} ٢٠٢٦ · سجل توضيحي</p>
      <div className="expense-amount-box">
        <span>مبلغ المصروف للفترة</span>
        <strong>
          <Money value={r.amount} />
        </strong>
        <small>غير شامل الضريبة · بيانات تجريبية</small>
      </div>
      <dl className="expense-dl">
        {[
          ["الجهة", r.vendor],
          ["تاريخ المصروف", number(r.day) + " " + m.name + " ٢٠٢٦"],
          ["الفترة التي يخصها", m.name + " ٢٠٢٦"],
          ["التكرار", r.recurring ? "شهري" : "غير متكرر"],
          ...(r.recurring ? [["موعد التجديد التالي", renewal]] : []),
          ["التصنيف", categoryName(r.category)],
        ].map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <section className="evidence-block">
        <h3>عن هذا المصروف</h3>
        <p>{r.description}</p>
      </section>
      <section className="evidence-block">
        <h3>المقارنة بالفترة السابقة</h3>
        {month === "sep" && (
          <table className="ledger">
            <tbody>
              <tr>
                <td>أغسطس</td>
                <td>{r.aug == null ? "غير متوفر" : <Money value={r.aug} />}</td>
              </tr>
              <tr>
                <td>سبتمبر</td>
                <td>
                  <Money value={r.amount} />
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="comparison-note">
          <Icon name="info" />
          <span>{comparison}</span>
        </div>
        <p className="sheet-disclaimer">
          المقارنة للبند نفسه، ولا تعني الزيادة أو الانخفاض وحدهما وجود مشكلة أو
          تحقق وفر.
        </p>
      </section>
      <section className="evidence-block">
        <h3>مرجع السجل التجريبي</h3>
        <div className="expense-source">
          <span>
            مصروفات_{m.name}.xlsx · الصف {number(r.sourceRow)}
          </span>
          <span>
            معرّف البند: <bdi>{r.id}</bdi>
          </span>
          <small>مرجع توضيحي لتجربة المنتج؛ لا يوجد ملف فعلي مرفوع.</small>
        </div>
      </section>
      <section className="evidence-block">
        <h3>فرصة التحسين المرتبطة</h3>
        {r.opportunity === 2 ? (
          <>
            <p>
              توجد خدمة أخرى بوظيفة مشابهة. راجعي الاستخدام وشروط الإلغاء قبل
              اتخاذ قرار.
            </p>
            <a
              className="related-opportunity"
              href={"opportunities.html?month=" + month + "&opportunity=2"}
            >
              راجع الاشتراكات المتكررة
              <small>عرض الأدلة وطريقة تقدير الوفر</small>
            </a>
          </>
        ) : (
          <p className="detail-empty">
            لا توجد فرصة تحسين مرتبطة بهذا البند في البيانات الحالية.
          </p>
        )}
      </section>
      <p className="sheet-disclaimer">
        هذه الصفحة للاستعراض والتحليل. لا يتم تعديل المصروف أو إلغاء الاشتراك أو
        تنفيذ دفعات من هذه النسخة.
      </p>
    </>
  );
}
