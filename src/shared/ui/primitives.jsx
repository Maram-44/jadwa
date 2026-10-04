import React from "react";
import { opportunities } from "../data/demo.js";
export const number = (value, digits = 2) =>
  new Intl.NumberFormat("ar-SA", { maximumFractionDigits: digits }).format(
    value,
  );
export function Riyal() {
  return <span className="riyal-symbol" role="img" aria-label="ريال سعودي" />;
}
export function Money({ value }) {
  return value === null ? (
    "—"
  ) : (
    <>
      {number(value)} <Riyal />
    </>
  );
}
export function Text({ children }) {
  return String(children ?? "")
    .split("⃁")
    .map((part, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Riyal />}
        {part}
      </React.Fragment>
    ));
}
export function Icon({ name, ...props }) {
  return (
    <svg aria-hidden="true" {...props}>
      <use href={"#" + name} />
    </svg>
  );
}
export function Skeleton({ chart = false }) {
  return (
    <div className="skeleton-overlay" aria-hidden="true">
      <span className={"skeleton-bar " + (chart ? "sk-title" : "sk-label")} />
      <span className={"skeleton-bar " + (chart ? "sk-caption" : "sk-value")} />
      <span className={"skeleton-bar " + (chart ? "sk-chart" : "sk-caption")} />
      {!chart && <span className="skeleton-bar sk-bottom" />}
    </div>
  );
}
export function Summary({
  icon,
  title,
  value,
  note,
  featured = false,
  loading = false,
}) {
  return (
    <article
      className={
        "summary-card" +
        (featured ? " featured" : "") +
        (loading ? " is-loading" : "")
      }
      inert={loading}
    >
      <div className="summary-label">
        <Icon name={icon} />
        {title}
      </div>
      <div className="summary-number">
        <strong>{value}</strong>
      </div>
      <p>{note}</p>
      {loading && <Skeleton />}
    </article>
  );
}
export function Stat({ label, value, note }) {
  return (
    <div className="detail-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
export function Related({ ids, month }) {
  return ids.length ? (
    <>
      {ids.map((i) => (
        <a
          key={i}
          className="related-opportunity"
          href={"opportunities.html?month=" + month + "&opportunity=" + i}
        >
          {opportunities[i].title}
          <small>مراجعة الأدلة والإجراء المقترح</small>
        </a>
      ))}
    </>
  ) : (
    <p className="detail-empty">
      لا توجد فرصة تحسين مرتبطة بهذا الصنف في البيانات الحالية.
    </p>
  );
}
