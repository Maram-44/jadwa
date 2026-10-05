import { useState, useEffect } from "react";
import View from "./components/DashboardView.jsx";
import { months, opportunities as defaultOpportunities } from "../../shared/data/demo.js";
import { useQuery, useWorkspace } from "../../shared/lib/hooks.js";
import {
  number,
  Money,
  Text,
  Icon,
  Skeleton,
} from "../../shared/ui/primitives.jsx";
import { JadwaSession } from "../../shared/lib/session.js";
import { dashboardService } from "./services/dashboardService.js";
import { opportunityService } from "../opportunities/services/opportunityService.js";
import { useAuth } from "../../shared/lib/authContext.jsx";
import { computeAvatarInitial, formatChange } from "../../shared/types/dto.js";

function Chart({ m }) {
  const xs = [55, 220, 385, 550],
    y = (v) => 145 - (v / 16000) * 125,
    path = (v) =>
      v.map((n, i) => (i ? "L" : "M") + xs[i] + " " + y(n)).join(" "),
    labels = [
      "الأسبوع الأول",
      "الأسبوع الثاني",
      "الأسبوع الثالث",
      "الأسبوع الرابع",
    ];
  return (
    <svg
      className="chart-svg"
      viewBox="0 0 600 180"
      role="img"
      aria-label={
        "المبيعات والتكاليف الأسبوعية لشهر " +
        m.name +
        "، جميع قيم المبيعات أعلى من التكاليف. اضغط عرض الأرقام للتفاصيل."
      }
      dir="ltr"
    >
      <defs>
        <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#2563eb" stopOpacity=".12" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 5000, 10000, 15000].map((v) => (
        <g key={v}>
          <line
            x1="55"
            x2="550"
            y1={y(v)}
            y2={y(v)}
            stroke="#e9eef6"
            strokeDasharray="3 5"
          />
          <text x="36" y={y(v) + 4} textAnchor="end">
            {v ? number(v / 1000) + " ألف" : "٠"}
          </text>
        </g>
      ))}
      <path d={path(m.sales) + " L550 145 L55 145Z"} fill="url(#fillBlue)" />
      <path d={path(m.costs)} fill="none" stroke="#25be98" strokeWidth="2.3" />
      <path d={path(m.sales)} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      {m.sales.map((v, i) => (
        <g key={i}>
          <circle
            cx={xs[i]}
            cy={y(v)}
            r="4"
            fill="#2563eb"
            stroke="white"
            strokeWidth="2"
          >
            <title>
              {labels[i] +
                ": مبيعات " +
                number(v) +
                " ريال، تكاليف " +
                number(m.costs[i]) +
                " ريال"}
            </title>
          </circle>
          <circle
            cx={xs[i]}
            cy={y(m.costs[i])}
            r="3"
            fill="#25be98"
            stroke="white"
            strokeWidth="1.5"
          />
          <text x={xs[i]} y="171" textAnchor="middle">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const isGuest = user?.isGuest ?? false;

  const [params, update] = useQuery(),
    month = Object.hasOwn(months, params.get("month"))
      ? params.get("month")
      : "sep",
    workspace = useWorkspace(month, "dashboard");

  useEffect(() => {
    if (!authLoading && !user) {
      location.replace("login.html");
    }
  }, [authLoading, user]);

  const [metricData, setMetricData] = useState(null);
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;
    setLoading(true);

    Promise.all([
      dashboardService.getPeriodMetrics(month, isGuest),
      opportunityService.getOpportunities(month, isGuest),
    ]).then(([periodRes, opsRes]) => {
      if (!active) return;
      if (periodRes) {
        setMetricData(periodRes);
      }
      setOpportunitiesList(opsRes || []);
      setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [month, authLoading, user, isGuest]);

  const m = metricData || {
    name: month === "aug" ? "أغسطس" : "سبتمبر",
    revenue: 0,
    cost: 0,
    profit: 0,
    saving: 0,
    sales: [0, 0, 0, 0],
    costs: [0, 0, 0, 0],
    changes: ["٠٪", "٠٪", "٠٪"],
    amounts: [0, 0, 0],
  };

  const displayName = user?.profile?.fullName || (isGuest ? "الشيماء" : (user?.email?.split("@")[0] || "مستخدم"));
  const avatarChar = isGuest
    ? "ش"
    : (computeAvatarInitial(user?.profile?.fullName, user?.email) || (displayName ? displayName.charAt(0) : "م"));
  const [dialog, setDialog] = useState(null),
    [answer, setAnswer] = useState("");
  const period = JadwaSession.periodFor(month),
    files = JadwaSession.forPeriod(period);

  const open = (kind) => {
    setAnswer("");
    setDialog(kind);
    workspace.closeMenu();
  };
  const close = () => setDialog(null);
  const go = (page) => (location.href = page);

  const firstSaving = m.amounts?.[0] || 1200;
  const answers = {
    saving: `ابدئي بمراجعة هدر المكونات: هو أكبر فرصة في هذا المثال، بوفر محتمل ${number(firstSaving)} ⃁ من أصل ${number(m.saving)} ⃁. راجعي الاستهلاك الفعلي قبل تعديل كميات الشراء.`,
    profit: `صافي الربح في عينة ${m.name} = المبيعات ${number(m.revenue)} ⃁ − إجمالي التكاليف ${number(m.cost)} ⃁ = ${number(m.profit)} ⃁. تشمل التكاليف تكلفة المبيعات والمصروفات والهدر مرة واحدة.`,
    sources:
      "التحليل في هذه النسخة مبني على بيانات المبيعات والتكاليف والمخزون والهدر مع الربط بقاعدة بيانات السحابة.",
  };

  let content;
  if (dialog === "meeting")
    content = (
      <>
        <h2 id="dialog-title" className="dialog-title">
          كيف تحبّين نبدأ الاجتماع؟
        </h2>
        <p className="dialog-description">
          أضيفي ملفات جديدة قبل الدخول، أو تابعي بالبيانات المتاحة للفترة
          المحددة.
        </p>
        <div className="meeting-choices">
          <button
            className="meeting-choice"
            id="meeting-upload"
            onClick={() =>
              go("data-hub.html?month=" + month + "&return=meeting")
            }
          >
            <Icon name="file" />
            <span>
              <strong>إضافة ملفات قبل الاجتماع</strong>
              <small>
                افتحي مركز البيانات لرفع ملفات CSV ومراجعتها، ثم انتقلي
                للاجتماع.
              </small>
            </span>
          </button>
          <button
            className="meeting-choice primary-choice"
            id="meeting-continue"
            onClick={() =>
              go(
                "meeting.html?month=" +
                  month +
                  "&period=" +
                  period +
                  "&mode=" +
                  (files.length ? "files" : "demo"),
              )
            }
          >
            <Icon name="video" />
            <span>
              <strong>
                {files.length
                  ? "المتابعة بالملفات الموجودة"
                  : "المتابعة بالبيانات التوضيحية"}
              </strong>
              <small>
                {files.length
                  ? number(files.length) +
                    " ملفات مجهزة في هذا التبويب لفترة " +
                    m.name
                  : "لا توجد ملفات مضافة لهذه الفترة. يمكنك استكشاف الغرفة ببيانات المشروع التوضيحية."}
              </small>
            </span>
          </button>
        </div>
        <ul id="meeting-files" className="meeting-file-list">
          {files.map((f) => (
            <li key={f.id}>
              {f.name}
              {f.origin === "demo" ? " · عينة توضيحية" : ""}
            </li>
          ))}
        </ul>
        <p className="meeting-note">
          الملفات تبقى مؤقتًا في هذا التبويب. الغرفة متاحة للمعاينة؛ المحادثة
          الصوتية وتحليل الملفات بالذكاء الاصطناعي لم يُفعّلا بعد.
        </p>
      </>
    );
  else if (dialog === "advisor")
    content = (
      <>
        <h2 id="dialog-title" className="dialog-title">
          ما الذي تودّين معرفته؟
        </h2>
        <p className="dialog-description">
          اختاري سؤالًا لتجربة طريقة عرض الإجابة. الإجابات هنا معدّة من بيانات
          المثال؛ لا يوجد اتصال بنموذج ذكاء اصطناعي بعد.
        </p>
        {[
          ["saving", "من أين أبدأ لتحسين الربحية؟"],
          ["profit", "كيف تم حساب صافي الربح؟"],
          ["sources", "ما البيانات التي بُني عليها التحليل؟"],
        ].map(([key, label]) => (
          <button
            key={key}
            className="suggestion"
            data-question={key}
            onClick={() => setAnswer(answers[key])}
          >
            {label}
          </button>
        ))}
        <div
          id="advisor-answer"
          className={answer ? "advisor-answer" : ""}
          aria-live="polite"
        >
          <Text>{answer}</Text>
        </div>
      </>
    );
  else if (dialog === "chart")
    content = (
      <>
        <h2 id="dialog-title" className="dialog-title">
          الأرقام الأسبوعية · {m.name}
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>الأسبوع</th>
              <th>المبيعات</th>
              <th>التكاليف</th>
            </tr>
          </thead>
          <tbody>
            {m.sales.map((v, i) => (
              <tr key={i}>
                <td>{number(i + 1)}</td>
                <td>
                  <Money value={v} />
                </td>
                <td>
                  <Money value={m.costs[i]} />
                </td>
              </tr>
            ))}
            <tr>
              <th>الإجمالي</th>
              <th>
                <Money value={m.revenue} />
              </th>
              <th>
                <Money value={m.cost} />
              </th>
            </tr>
          </tbody>
        </table>
        <p className="dialog-description">
          القيم توضيحية، ومتسقة مع مؤشرات الملخص.
        </p>
        <button className="primary-button" onClick={close}>
          إغلاق
        </button>
      </>
    );

  const slots = {
    "mini-avatar": avatarChar,
    "demo-label": isGuest ? "بيانات توضيحية" : "بيانات المنشأة",
    greeting: (
      <>
        {"صباح الخير، " + displayName + " "}
        <span className="greeting-dot"></span>
      </>
    ),
    "topbar-actions": (
      <button
        type="button"
        className="icon-button"
        onClick={logout}
        title="تسجيل الخروج"
        aria-label="تسجيل الخروج"
        style={{
          background: "transparent",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "4px 8px",
          fontSize: "12px",
          color: "#64748b",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
        }}
      >
        <svg style={{ width: "14px", height: "14px" }}>
          <use href="#logout" />
        </svg>
        <span>خروج</span>
      </button>
    ),
    "period-footer": (isGuest ? "نسخة تجريبية · " : "فترة ") + m.name + " ٢٠٢٦",
    ...Object.fromEntries(
      ["revenue", "cost", "profit", "saving"].map((k) => [k, number(m[k] || 0)]),
    ),
    ...Object.fromEntries(
      ["revenue", "cost", "profit"].map((k, i) => [
        k + "-change",
        formatChange(m.changes?.[i]) || "",
      ]),
    ),
    "chart-wrap": <Chart m={m} />,
    "loading-status":
      (loading ? "جاري تحميل بيانات " : "تم تحميل بيانات ") + m.name,
    "dialog-eyebrow":
      dialog === "meeting"
        ? "اجتماع مع جدوى"
        : dialog === "advisor"
          ? "اسأل جدوى · معاينة"
          : "أداء المنشأة",
    "dialog-content": content,
    "opportunity-grid": opportunitiesList.length > 0 ? opportunitiesList.map((o, i) => {
      const savingAmt = o.potentialSaving ?? m.amounts?.[i] ?? 0;
      return (
        <article
          key={i}
          className={"opportunity-card" + (loading ? " is-loading" : "")}
          style={{ "--accent": o.accent, "--tint": o.tint }}
          inert={loading}
        >
          <div className="opportunity-top">
            <span className="category">{o.category}</span>
            <span className="opportunity-icon">
              <Icon name={o.icon} />
            </span>
          </div>
          <h3>{o.title}</h3>
          <p>{o.text}</p>
          <div className="opportunity-saving">
            <span>وفر محتمل / الشهر</span>
            <b>
              <Money value={savingAmt} />
            </b>
          </div>
          <button
            data-opportunity={i}
            aria-label={"راجع تفاصيل: " + o.title}
            onClick={() =>
              go("opportunities.html?month=" + month + "&opportunity=" + i)
            }
          >
            راجع التفاصيل
          </button>
          {loading && <Skeleton />}
        </article>
      );
    }) : (
      !loading ? (
        <div style={{ gridColumn: "1 / -1", padding: "32px", textAlign: "center", color: "#64748b", background: "white", borderRadius: "12px", border: "1px solid #e9edf3" }}>
          <p style={{ margin: "0 0 6px", fontWeight: "500", color: "#334155" }}>لا توجد فرص مسجلة حاليًا لهذه الفترة</p>
          <small style={{ color: "#94a3b8" }}>يمكنك إضافة ملفات المبيعات والمصروفات من مركز البيانات لبدء التحليل واكتشاف فرص التوفير.</small>
        </div>
      ) : null
    ),
  };

  return (
    <View
      active="dashboard"
      loading={loading}
      slots={slots}
      refs={workspace.refs}
      bindings={{
        ...workspace.bindings,
        period: {
          value: month,
          onChange: (e) => update({ month: e.target.value }),
        },
        "meeting-button": { onClick: () => open("meeting") },
        "advisor-button": { onClick: () => open("advisor") },
        "chart-data": { onClick: () => open("chart") },
        "detail-dialog": { open: !!dialog, onClose: close },
        "close-dialog": { onClick: close },
        ".metrics": { "aria-busy": loading },
        ".opportunity-grid": { "aria-busy": loading },
        ".bottom-grid": { "aria-busy": loading },
      }}
    />
  );
}
