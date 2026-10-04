import { HubData } from "../model/csv.js";
import { number, Icon } from "../../../shared/ui/primitives.jsx";
export const monthName = (p) =>
  p
    ? new Intl.DateTimeFormat("ar-SA", {
        month: "long",
        year: "numeric",
        calendar: "gregory",
        timeZone: "UTC",
      }).format(new Date(p + "-01T00:00:00Z"))
    : "—";
export const time = (t) =>
  new Intl.DateTimeFormat("ar-SA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(t));
export const warnCount = (r) =>
  r.issues.filter((i) => i.level === "warning").length;
export function Badge({ result: r }) {
  return (
    <span className={"hub-badge " + (warnCount(r) ? "review" : "ready")}>
      {warnCount(r) ? "يحتاج مراجعة ربط" : "جاهز للربط"}
    </span>
  );
}
export function PreviewTable({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, 5).map((r, i) => (
          <tr key={i}>
            {r.cells.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function Issues({ result }) {
  return !result.issues.length ? (
    <div className="hub-issue">
      <Icon name="check" /> اجتازت السجلات فحوص الحقول والتواريخ والأرقام. هذا
      لا يتحقق من صحة المستندات الأصلية.
    </div>
  ) : (
    <>
      {result.issues.slice(0, 50).map((i, n) => (
        <div key={n} className={"hub-issue " + i.level}>
          <b>
            {i.line ? "السطر " + number(i.line) + " · " : ""}
            {i.field}
          </b>
          <br />
          {i.message}
        </div>
      ))}
      {result.issues.length > 50 && (
        <p className="hub-small">
          عرض أول ٥٠ ملاحظة من {number(result.issues.length)}. صحح الملف وأعد
          رفعه لمراجعة البقية.
        </p>
      )}
    </>
  );
}
export function FileSummary({ file: d }) {
  return (
    <dl className="hub-confirm">
      {[
        ["اسم الملف", d.name],
        ["المصدر", HubData.schemas[d.type].label],
        ["الفترة", monthName(d.result.period)],
        ["سجلات ستُجهّز", number(d.result.valid.length)],
        ["سجلات ستُستبعد", number(d.result.invalid.length)],
        ["ملاحظات للمراجعة", number(warnCount(d.result))],
      ].map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
export default function FileDetails({ file: f, onReplace }) {
  if (!f) return null;
  return (
    <>
      <Badge result={f.result} />
      <FileSummary file={f} />
      <p className="hub-small">
        {f.origin === "demo"
          ? "عينة توضيحية مصغرة لتجربة الاستيراد، وليست ملفات التحليلات الحالية."
          : "قراءة محلية لملفك. لا توجد نسخة محفوظة على خادم."}
      </p>
      <h3>الأعمدة المطابقة</h3>
      <dl className="hub-confirm">
        {HubData.schemas[f.type].fields
          .filter((k) => f.mapping[k] >= 0)
          .map((k) => (
            <div key={k}>
              <dt>{HubData.fields[k][0]}</dt>
              <dd>{f.parsed.headers[f.mapping[k]]}</dd>
            </div>
          ))}
      </dl>
      <h3>أول خمسة سجلات مقبولة</h3>
      <div className="hub-table-scroll">
        <PreviewTable headers={f.parsed.headers} rows={f.result.valid} />
      </div>
      <h3 style={{ marginTop: 24 }}>ملاحظات الفحص</h3>
      <Issues result={f.result} />
      <button className="hub-secondary" onClick={() => onReplace(f)}>
        اختيار ملف بديل
      </button>
    </>
  );
}
