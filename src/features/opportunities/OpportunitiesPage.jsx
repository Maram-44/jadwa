import { useState, useEffect, useRef } from "react";
import View from "./components/OpportunitiesView.jsx";
import { months, opportunities as defaultOpportunities } from "../../shared/data/demo.js";
import {
  useQuery,
  useWorkspace,
  useToast,
} from "../../shared/lib/hooks.js";
import {
  number,
  Money,
  Text,
  Icon,
  Skeleton,
} from "../../shared/ui/primitives.jsx";
import InfoContent from "../../shared/ui/InfoContent.jsx";
import { opportunityService } from "./services/opportunityService.js";
import { measurementSchema, dismissSchema } from "./schemas/opportunitySchemas.js";

const statuses = {
    new: "جديدة",
    active: "قيد التنفيذ",
    awaiting: "بانتظار القياس",
    completed: "مكتملة",
    dismissed: "غير مناسبة",
  },
  workflow = ["new", "active", "awaiting", "completed"];

const fresh = () =>
  defaultOpportunities.map(() => ({ status: "new", reason: "", measurement: null }));

function OpportunityDetails({ id, month, s, o, transition }) {
  const m = months[month],
    step = workflow.indexOf(s.status),
    [mode, setMode] = useState("detail"),
    [context, setContext] = useState(""),
    [error, setError] = useState(""),
    form = useRef(),
    title = useRef(),
    actions = useRef();

  useEffect(() => {
    if (mode !== "detail") {
      form.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      form.current
        ?.querySelector("input,textarea")
        ?.focus({ preventScroll: true });
    }
  }, [mode]);

  function next(status, extra = {}) {
    transition(status, extra);
    setMode("detail");
    requestAnimationFrame(() =>
      status === "completed"
        ? title.current?.focus()
        : actions.current
            ?.querySelector("button")
            ?.focus({ preventScroll: true }),
    );
  }

  const feedback = {
    active:
      "الفرصة قيد التنفيذ. بعد تطبيق الإجراء، انقليها إلى انتظار قياس الأثر.",
    awaiting:
      "تم تسجيل تنفيذ الإجراء. لم يُحتسب أي وفر محقق؛ يلزم مقارنة التكاليف على أساس متكافئ.",
    dismissed:
      "تم استبعاد الفرصة من إجمالي الوفر المحتمل." +
      (s.reason ? " السبب: " + s.reason : ""),
    completed:
      "اكتملت المتابعة. النتيجة أدناه مسجلة ومحفوظة في قاعدة بيانات المنشأة.",
  };

  function measure(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      payload = {
        before: Number(f.get("before")),
        after: Number(f.get("after")),
        basis: (f.get("basis") || "").trim(),
        source: (f.get("source") || "").trim(),
      };

    const result = measurementSchema.safeParse(payload);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      setError(issues[0]?.message || "أدخلي تكاليف صحيحة وأكملي أساس المقارنة ومرجع القياس.");
      return;
    }

    if (s.status === "awaiting") {
      next("completed", { measurement: result.data });
    }
  }

  function dismiss(e) {
    e.preventDefault();
    const rawReason = new FormData(e.currentTarget).get("reason");
    const result = dismissSchema.safeParse({ reason: rawReason ? String(rawReason).trim() : undefined });
    next("dismissed", { reason: result.success ? result.data.reason || "" : "" });
  }

  return (
    <>
      <div className="sheet-title-row">
        <span className="sheet-category" style={{ "--accent": o.accent }}>
          <Icon name={o.icon} />
          {o.category}
        </span>
        <span className={"status-badge status-" + s.status}>
          {statuses[s.status]}
        </span>
      </div>
      <h2 id="sheet-title" ref={title} tabIndex={-1}>
        {o.title}
      </h2>
      <p className="sheet-period">{m.name} ٢٠٢٦ · بيانات المنشأة</p>
      <div className="sheet-saving">
        <div>
          <p>الوفر الشهري المحتمل</p>
          <small>تقدير قبل التنفيذ والقياس</small>
        </div>
        <strong>
          <Money value={o.potentialSaving ?? m.amounts[id]} />
        </strong>
      </div>
      {step >= 0 && (
        <ol className="workflow-steps" aria-label="مراحل المتابعة">
          {workflow.map((status, n) => (
            <li
              key={status}
              className={
                (n <= step ? "reached" : "") +
                " " +
                (n === step ? "current" : "")
              }
              aria-current={n === step ? "step" : undefined}
            >
              {statuses[status]}
            </li>
          ))}
        </ol>
      )}
      {feedback[s.status] && (
        <div className="state-feedback">{feedback[s.status]}</div>
      )}
      {s.measurement && (
        <div
          className={
            "measurement-result " +
            (s.measurement.before < s.measurement.after ? "negative" : "")
          }
        >
          <h3>فرق التكلفة المسجل</h3>
          <strong>
            <Money value={s.measurement.before - s.measurement.after} />
          </strong>
          <p>
            {s.measurement.before < s.measurement.after
              ? "ارتفعت التكلفة بعد الإجراء."
              : s.measurement.before === s.measurement.after
                ? "لم تتغير التكلفة."
                : "انخفضت التكلفة في المقارنة المدخلة."}{" "}
            هذا الفرق وحده لا يثبت أن الإجراء سبب التغير.
          </p>
          <p>
            أساس المقارنة: {s.measurement.basis}
            <br />
            المصدر: {s.measurement.source}
          </p>
        </div>
      )}
      <section className="evidence-block">
        <h3>ما الذي لاحظه جدوى؟</h3>
        <p>{o.evidence}</p>
        <div className="source-reference">
          <Icon name="file" />
          <span>{o.source}</span>
        </div>
      </section>
      <section className="evidence-block">
        <h3>كيف قُدّر الوفر؟</h3>
        <p className="calculation-text">
          <Text>
            {month === "sep"
              ? o.calculation
              : `تقدير توضيحي لشهر أغسطس بقيمة ${number(m.amounts[id])} ⃁. تختلف افتراضات حجم النشاط عن سبتمبر؛ لا يُعد هذا المبلغ وفرًا محققًا.`}
          </Text>
        </p>
      </section>
      <button
        className="context-question"
        onClick={() =>
          (location.href =
            id < 2
              ? "products.html?month=" +
                month +
                "&tab=" +
                (id === 0 ? "inventory" : "products") +
                "&opportunity=" +
                id
              : "expenses.html?month=" + month + "&opportunity=2")
        }
      >
        <Icon name={id < 2 ? "box" : "wallet"} />
        {id < 2 ? "عرض الأصناف المرتبطة" : "عرض المصروفات المرتبطة"}
      </button>
      <section className="steps-block">
        <h3>خطوات مقترحة</h3>
        <ol>
          {o.steps.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
      </section>
      <button
        className="context-question"
        onClick={() =>
          setContext(
            "معاينة إجابة مرتبطة بهذه الفرصة: " +
              o.steps[0] +
              " ابدئي بمراجعة المصدر والافتراضات الموضحة أعلاه.",
          )
        }
      >
        <Icon name="spark" />
        اسأل جدوى عن هذه الفرصة
      </button>
      <div
        id="context-response"
        className="context-response"
        aria-live="polite"
      >
        {context}
      </div>
      {mode === "dismiss" ? (
        <form
          id="dismiss-form"
          className="measurement-block"
          ref={form}
          onSubmit={dismiss}
        >
          <h3>لماذا لا تناسبك هذه الفرصة؟</h3>
          <label className="field">
            السبب (اختياري)
            <textarea
              name="reason"
              maxLength={300}
              placeholder="مثلًا: الاشتراك ضروري لفريق آخر"
            />
          </label>
          <div className="form-actions">
            <button className="primary-button" type="submit">
              تأكيد الاستبعاد
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setMode("detail")}
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : mode === "measure" ? (
        <form
          id="measurement-form"
          ref={form}
          className="measurement-block"
          onSubmit={measure}
        >
          <h3>قياس أثر الفرصة</h3>
          <p>
            أدخلي تكلفة البند نفسه لفترتين قابلتين للمقارنة، مع توضيح المدة وحجم
            النشاط.
          </p>
          <div className="field-grid">
            {[
              ["before", "التكلفة قبل الإجراء"],
              ["after", "التكلفة بعد الإجراء"],
            ].map(([name, label]) => (
              <label className="field" key={name}>
                {label}
                <input
                  name={name}
                  type="number"
                  min="0"
                  max="1000000000"
                  step="0.01"
                  required
                  inputMode="decimal"
                  aria-label={label + " بالريال السعودي"}
                />
              </label>
            ))}
          </div>
          <label className="field">
            أساس المقارنة
            <textarea
              name="basis"
              maxLength={500}
              required
              placeholder="الفترتان، مدتهما، ومدى تقارب حجم النشاط"
            />
          </label>
          <label className="field">
            مرجع القياس
            <input
              name="source"
              maxLength={250}
              required
              placeholder="مثلًا: سجل هدر المكونات للفترتين"
            />
          </label>
          <p id="measurement-error" className="form-error" role="alert">
            {error}
          </p>
          <div className="form-actions">
            <button className="primary-button" type="submit">
              تسجيل النتيجة وحفظها
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setMode("detail")}
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className="sheet-actions" ref={actions}>
          {s.status === "new" ? (
            <>
              <button className="primary-button" onClick={() => next("active")}>
                ابدأ المتابعة
              </button>
              <button
                className="secondary-button"
                onClick={() => setMode("dismiss")}
              >
                ليست مناسبة
              </button>
            </>
          ) : s.status === "active" ? (
            <>
              <button
                className="primary-button"
                onClick={() => next("awaiting")}
              >
                تم تنفيذ الإجراء
              </button>
              <button
                className="secondary-button"
                onClick={() => setMode("dismiss")}
              >
                إيقاف المتابعة
              </button>
            </>
          ) : s.status === "awaiting" ? (
            <>
              <button
                className="primary-button"
                onClick={() => {
                  setError("");
                  setMode("measure");
                }}
              >
                سجّل قياس الأثر
              </button>
              <button
                className="secondary-button"
                onClick={() => next("active")}
              >
                العودة إلى التنفيذ
              </button>
            </>
          ) : s.status === "dismissed" ? (
            <button className="secondary-button" onClick={() => next("new")}>
              إعادة الفرصة للمراجعة
            </button>
          ) : null}
        </div>
      )}
      <p className="sheet-disclaimer">
        حالات المتابعة وإدخالات القياس متزامنة ومحفوظة في قاعدة بيانات جدوى.
      </p>
    </>
  );
}

export default function OpportunitiesPage() {
  const [params, update] = useQuery(),
    month = Object.hasOwn(months, params.get("month"))
      ? params.get("month")
      : "sep",
    m = months[month],
    w = useWorkspace(month, "opportunities");

  const [loading, setLoading] = useState(true);
  const [opportunitiesList, setOpportunitiesList] = useState(defaultOpportunities);
  const [stateByMonth, setStates] = useState({ sep: fresh(), aug: fresh() });
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("highest");
  const [current, setCurrent] = useState(null);
  const [toast, showToast] = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);

    opportunityService.getOpportunities(month).then((res) => {
      if (!active) return;
      if (res && res.length > 0) {
        setOpportunitiesList(res);
        setStates((prev) => ({
          ...prev,
          [month]: res.map((item) => ({
            status: item.status || "new",
            reason: item.dismissReason || "",
            measurement: item.measurement || null,
          })),
        }));
      }
      setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [month]);

  const states = stateByMonth[month] || fresh();
  const ids = opportunitiesList
    .map((_, i) => i)
    .filter((i) => category === "all" || String(i) === category)
    .sort((a, b) => {
      const amtA = opportunitiesList[a].potentialSaving ?? m.amounts[a];
      const amtB = opportunitiesList[b].potentialSaving ?? m.amounts[b];
      return sort === "lowest"
        ? amtA - amtB
        : sort === "status"
          ? Object.keys(statuses).indexOf(states[a]?.status || "new") -
              Object.keys(statuses).indexOf(states[b]?.status || "new") ||
            amtB - amtA
          : amtB - amtA;
    });

  useEffect(() => {
    if (
      !loading &&
      params.has("opportunity") &&
      opportunitiesList[Number(params.get("opportunity"))]
    )
      setCurrent(Number(params.get("opportunity")));
  }, [loading]);

  async function transition(next, extra = {}) {
    const allowed = {
      new: ["active", "dismissed"],
      active: ["awaiting", "dismissed"],
      awaiting: ["active", "completed"],
      dismissed: ["new"],
      completed: [],
    };
    if (!allowed[states[current]?.status]?.includes(next)) return;

    setStates((prev) => ({
      ...prev,
      [month]: prev[month].map((s, i) =>
        i === current ? { ...s, ...extra, status: next } : s,
      ),
    }));

    await opportunityService.updateOpportunity(month, current, {
      status: next,
      reason: extra.reason,
      measurement: extra.measurement,
    });

    showToast("تم تحديث وحفظ حالة الفرصة بنجاح");
  }

  const waiting = states.filter((s) => s.status === "awaiting").length;
  const slots = {
    "potential-value": number(
      states.reduce(
        (sum, s, i) => {
          const amt = opportunitiesList[i]?.potentialSaving ?? m.amounts[i];
          return sum + (["dismissed", "completed"].includes(s.status) ? 0 : amt);
        },
        0,
      ),
    ),
    "new-count": number(states.filter((s) => s.status === "new").length),
    "active-count": number(states.filter((s) => s.status === "active").length),
    "pending-label": waiting
      ? number(waiting) + " بانتظار قياس الأثر"
      : "لا توجد فرص بانتظار قياس الأثر",
    "result-count": number(ids.length) + " من " + number(opportunitiesList.length),
    "period-footer": "نسخة تجريبية · " + m.name + " ٢٠٢٦",
    "opportunity-list": ids.map((i) => {
      const o = opportunitiesList[i],
        s = states[i] || { status: "new" },
        amt = o.potentialSaving ?? m.amounts[i],
        rank =
          [0, 1, 2]
            .sort((a, b) => (opportunitiesList[b]?.potentialSaving ?? m.amounts[b]) - (opportunitiesList[a]?.potentialSaving ?? m.amounts[a]))
            .indexOf(i) + 1;
      return (
        <article
          key={i}
          className={
            "opportunity-row " +
            (["dismissed", "completed"].includes(s.status)
              ? "row-excluded "
              : "") +
            (loading ? "is-loading" : "")
          }
          style={{ "--accent": o.accent }}
          inert={loading}
        >
          <span className="rank-number" aria-label={"الأولوية " + number(rank)}>
            {number(rank).padStart(2, "٠")}
          </span>
          <div className="row-copy">
            <div className="row-category">
              <Icon name={o.icon} />
              {o.category}
            </div>
            <h3>{o.title}</h3>
            <p>{o.text}</p>
          </div>
          <div className="row-amount">
            <span>وفر محتمل / الشهر</span>
            <strong>
              <Money value={amt} />
            </strong>
          </div>
          <div className="row-status">
            <span className={"status-badge status-" + s.status}>
              {statuses[s.status]}
            </span>
          </div>
          <button
            className="review-button"
            data-review={i}
            aria-label={"مراجعة: " + o.title}
            onClick={() => {
              setCurrent(i);
              w.closeMenu();
            }}
          >
            مراجعة الفرصة
          </button>
          {loading && <Skeleton />}
        </article>
      );
    }),
    "sheet-content":
      current !== null && opportunitiesList[current] ? (
        <OpportunityDetails
          key={month + current}
          id={current}
          month={month}
          s={states[current] || { status: "new" }}
          o={opportunitiesList[current]}
          transition={transition}
        />
      ) : null,
    "dialog-content": (
      <InfoContent info={w.info} onClose={() => w.setInfo(null)} />
    ),
    toast: toast,
    "loading-status": loading
      ? "جاري تحميل فرص " + m.name
      : number(ids.length) + " فرص معروضة",
  };

  return (
    <View
      active="opportunities"
      loading={loading}
      slots={slots}
      refs={w.refs}
      bindings={{
        ...w.bindings,
        period: {
          value: month,
          onChange: (e) => {
            setCurrent(null);
            update({ month: e.target.value, opportunity: null });
          },
        },
        sort: { value: sort, onChange: (e) => setSort(e.target.value) },
        ...Object.fromEntries(
          ["all", "0", "1", "2"].map((c) => [
            "data-filter:" + c,
            {
              "aria-pressed": category === c,
              className: "filter-pill" + (category === c ? " selected" : ""),
              onClick: () => setCategory(c),
            },
          ]),
        ),
        ".opportunity-toolbar": { inert: loading },
        "opportunity-list": { "aria-busy": loading },
        "opportunity-dialog": {
          open: current !== null,
          onClose: () => setCurrent(null),
        },
        "close-sheet": { onClick: () => setCurrent(null) },
        toast: { className: "toast" + (toast ? " visible" : "") },
        "advisor-button": {
          onClick: () =>
            w.setInfo({
              title: "اسأل جدوى",
              text: "افتحي إحدى الفرص واختاري «اسأل جدوى عن هذه الفرصة» لمعاينة إجابة مرتبطة بها.",
            }),
        },
      }}
    />
  );
}
