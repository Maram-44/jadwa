import { useState, useRef, useEffect } from "react";
import View from "./components/DataHubView.jsx";
import { HubData } from "./model/csv.js";
import FileDetails, {
  monthName,
  time,
  warnCount,
  Badge,
  PreviewTable,
  Issues,
  FileSummary,
} from "./components/FileDetails.jsx";
import { JadwaSession } from "../../shared/lib/session.js";
import { dataHubService } from "./services/dataHubService.js";
import { csvFileMetaSchema } from "./schemas/dataHubSchemas.js";
import {
  useQuery,
  useLoading,
  useWorkspace,
  useToast,
} from "../../shared/lib/hooks.js";
import { Icon, number } from "../../shared/ui/primitives.jsx";
import Select from "../../shared/ui/Select.jsx";
const { schemas, fields } = HubData;
export default function DataHubPage() {
  const [params] = useQuery(),
    month = params.get("month") === "aug" ? "aug" : "sep",
    w = useWorkspace(month, "data-hub"),
    meetingFlow = params.get("return") === "meeting",
    loading = useLoading("hub", 250);
  const [activePeriod, setPeriod] = useState(() =>
      /^\d{4}-(0[1-9]|1[0-2])$/.test(params.get("period") || "")
        ? params.get("period")
        : JadwaSession.periodFor(month),
    ),
    [files, setFiles] = useState(() => JadwaSession.files()),
    [draft, setDraft] = useState(null),
    [step, setStep] = useState(1),
    [type, setType] = useState("sales"),
    [mapping, setMapping] = useState({}),
    [open, setOpen] = useState(false),
    [detail, setDetail] = useState(null),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false),
    [picked, setPicked] = useState("ملف واحد في كل مرة"),
    [drag, setDrag] = useState(false),
    [exclude, setExclude] = useState(false),
    [ack, setAck] = useState(false),
    [replace, setReplace] = useState(false),
    [toast, showToast] = useToast(5000);
  const fileInput = useRef(),
    dialog = useRef(),
    errorRef = useRef(),
    readToken = useRef(0),
    urls = useRef(new Set());
  useEffect(
    () => () => {
      readToken.current++;
      urls.current.forEach(URL.revokeObjectURL);
    },
    [],
  );
  useEffect(() => {
    dataHubService.getFiles().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setFiles(loaded);
      }
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: "nearest" });
  }, [error]);
  useEffect(() => {
    if (dialog.current) dialog.current.scrollTop = 0;
  }, [step]);
  const recordFor = (t, p = activePeriod, items = files) =>
      items.find((f) => f.type === t && f.result.period === p),
    shown = files.filter((f) => f.result.period === activePeriod),
    review = shown.filter((f) => warnCount(f.result)),
    periods = [
      ...new Set([
        "2026-08",
        "2026-09",
        activePeriod,
        ...files.map((f) => f.result.period),
      ]),
    ]
      .sort()
      .reverse();
  function changeStep(next) {
    setStep(next);
    setError("");
  }
  function closeImport() {
    readToken.current++;
    setOpen(false);
    setDraft(null);
    setReading(false);
  }
  function openImport(t) {
    readToken.current++;
    setDraft(null);
    setType(t);
    setPicked("ملف واحد في كل مرة");
    setReading(false);
    setExclude(false);
    setAck(false);
    setReplace(false);
    setMapping({});
    changeStep(1);
    setOpen(true);
    w.closeMenu();
  }
  async function readFile(file) {
    const token = ++readToken.current;
    setDraft(null);
    setError("");
    setReading(false);
    setPicked("ملف واحد في كل مرة");
    if (!file) return;
    const metaCheck = csvFileMetaSchema.safeParse({ name: file.name, size: file.size });
    if (!metaCheck.success) {
      const issues = metaCheck.error.issues || metaCheck.error.errors || [];
      setError(issues[0]?.message || "ملف غير صالح.");
      return;
    }
    setPicked(file.name);
    setReading(true);
    try {
      const buffer = await file.arrayBuffer();
      if (token !== readToken.current) return;
      let text;
      try {
        text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      } catch {
        throw new Error("تعذر قراءة الترميز. أعد تصدير الملف بصيغة CSV UTF-8.");
      }
      const parsed = HubData.parse(text);
      setDraft({ name: file.name, size: file.size, parsed, origin: "upload" });
      setPicked(file.name + " · " + number(parsed.rows.length) + " سجل");
    } catch (e) {
      if (token === readToken.current) {
        setError(
          e.message || "تعذرت قراءة الملف. أعد اختيار الملف وحاول مرة أخرى.",
        );
        setPicked("لم يُجهّز ملف؛ اختر ملفًا آخر أو أعد المحاولة.");
      }
    } finally {
      if (token === readToken.current) setReading(false);
    }
  }
  function download(t) {
    const url = URL.createObjectURL(
      new Blob([HubData.template(t, activePeriod)], {
        type: "text/csv;charset=utf-8",
      }),
    );
    urls.current.add(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Jadwa_" + t + "_" + activePeriod + ".csv";
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      urls.current.delete(url);
    }, 1000);
  }
  function next() {
    try {
      if (step === 1 && draft?.parsed) {
        setDraft({ ...draft, type });
        setMapping(HubData.suggest(type, draft.parsed.headers));
        changeStep(2);
      } else if (step === 2) {
        const map = Object.fromEntries(
          schemas[draft.type].fields.map((k) => [k, Number(mapping[k] ?? -1)]),
        );
        let result = HubData.validate(draft.type, draft.parsed, map);
        const sales = result.period && recordFor("sales", result.period);
        if (draft.type === "costs" && sales)
          result = HubData.validate(
            draft.type,
            draft.parsed,
            map,
            new Set(sales.result.valid.map((r) => r.values.code)),
          );
        setDraft({ ...draft, mapping: map, result });
        setExclude(false);
        setAck(false);
        changeStep(3);
        if (!result.valid.length)
          setError(
            "لا توجد سجلات صالحة للتجهيز. ارجع لمطابقة الأعمدة أو صحح ملفك وأعد اختياره.",
          );
      } else if (step === 3) {
        if (draft.result.invalid.length && !exclude) {
          setError(
            "راجع السجلات غير الصالحة ووافق على استبعادها، أو ارجع لتصحيح الملف.",
          );
          return;
        }
        if (warnCount(draft.result) && !ack) {
          setError("راجع الملاحظات وأكّد الاطلاع عليها قبل المتابعة.");
          return;
        }
        setDraft({
          ...draft,
          replaces: recordFor(draft.type, draft.result.period)?.id || null,
        });
        setReplace(false);
        changeStep(4);
      } else if (step === 4) {
        if (draft.replaces && !replace) {
          setError(
            "أكد استبدال الملف السابق، أو ارجع دون تغيير الملفات المجهزة.",
          );
          return;
        }
        const f = {
            ...draft,
            id:
              "file-" +
              Date.now() +
              "-" +
              Math.random().toString(36).slice(2, 8),
            preparedAt: Date.now(),
          },
          nextFiles = structuredClone(files).filter(
            (old) => old.id !== draft.replaces,
          );
        nextFiles.push(f);
        if (f.type === "sales") {
          const costs = recordFor("costs", f.result.period, nextFiles);
          if (costs)
            costs.result = HubData.validate(
              "costs",
              costs.parsed,
              costs.mapping,
              new Set(f.result.valid.map((r) => r.values.code)),
            );
        }
        JadwaSession.save(nextFiles);
        dataHubService.saveFile(f).catch(() => {});
        setFiles(nextFiles);
        setPeriod(f.result.period);
        closeImport();
        showToast(
          "تم تجهيز الملف " +
            (warnCount(f.result) ? "مع ملاحظات للمراجعة" : "للربط") +
            "؛ التحليلات الحالية لم تتغير.",
        );
      }
    } catch (e) {
      setError(e.message || "تعذر تجهيز الملف. راجع البيانات وحاول مجددًا.");
    }
  }
  function demo() {
    const nextFiles = [...files];
    let added = 0;
    for (const t of Object.keys(schemas)) {
      if (recordFor(t, activePeriod, nextFiles)) continue;
      const parsed = HubData.parse(HubData.template(t, activePeriod)),
        mapping = HubData.suggest(t, parsed.headers),
        sales = recordFor("sales", activePeriod, nextFiles),
        codes = sales
          ? new Set(sales.result.valid.map((r) => r.values.code))
          : null,
        result = HubData.validate(t, parsed, mapping, codes);
      nextFiles.push({
        id: "demo-" + t + "-" + activePeriod,
        type: t,
        name: "عينة_" + t + "_" + activePeriod + ".csv",
        parsed,
        mapping,
        result,
        origin: "demo",
        preparedAt: Date.now(),
      });
      added++;
    }
    try {
      JadwaSession.save(nextFiles);
      setFiles(nextFiles);
      showToast(
        added
          ? "أُضيفت عينات للمصادر الناقصة فقط؛ التحليلات التجريبية لم تتغير."
          : "المصادر الأربعة موجودة؛ لم نستبدل أي ملف.",
      );
    } catch (e) {
      showToast(e.message);
    }
  }
  let note =
    "ابدأ بملف المبيعات، ثم أضف تكلفة المنتجات لحساب الهوامش عند إتاحة الربط.";
  if (recordFor("sales") && !recordFor("costs"))
    note =
      "المبيعات مجهزة، وتكلفة المنتجات ناقصة. حساب الهوامش يحتاج المصدرين معًا.";
  else if (recordFor("costs") && !recordFor("sales"))
    note =
      "تكلفة المنتجات موجودة؛ أضف المبيعات لمراجعة الرموز والكميات والإيرادات.";
  else if (shown.length === 4)
    note = review.length
      ? "المصادر الأربعة موجودة، لكن بعض الملفات تحمل ملاحظات تحتاج مراجعة قبل الربط."
      : "المصادر الأربعة جاهزة للربط. التحليلات الحالية تظل تجريبية حتى إتاحة الربط.";
  else if (recordFor("sales") && recordFor("costs"))
    note =
      "المبيعات والتكلفة مجهزتان. أكمل المخزون والمصروفات لتجهيز صورة المنشأة كاملة.";
  const existing = draft?.replaces
    ? files.find((f) => f.id === draft.replaces)
    : null;
  const slots = {
    "hub-steps": [
      "اختيار الملف",
      "مطابقة الأعمدة",
      "مراجعة البيانات",
      "التأكيد",
    ].map((text, i) => (
      <li key={text} aria-current={i + 1 === step ? "step" : undefined}>
        {text}
      </li>
    )),
    "hub-period": periods.map((p) => (
      <option key={p} value={p}>
        {monthName(p)}
      </option>
    )),
    "meeting-prep-summary": shown.length
      ? number(shown.length) +
        " ملفات مجهزة لفترة " +
        monthName(activePeriod) +
        ". يمكنك الدخول أو إضافة ملف آخر."
      : "أضيفي ملفًا لهذه الفترة وراجعيه، ثم انتقلي إلى الغرفة.",
    "source-count": number(shown.length) + " من ٤",
    "review-count": number(review.length) + " ملفات",
    "last-prepared": shown.length
      ? time(Math.max(...shown.map((f) => f.preparedAt)))
      : "لم تُجهّز ملفات بعد",
    "readiness-note": (
      <>
        <Icon name="info" />
        <span>{note}</span>
      </>
    ),
    "source-cards": Object.entries(schemas).map(([t, s]) => {
      const f = recordFor(t);
      return (
        <article key={t} className="hub-source">
          <div className="hub-source-top">
            <div className="hub-source-title">
              <Icon name={s.icon} />
              <h3>{s.label}</h3>
            </div>
            {f ? (
              <Badge result={f.result} />
            ) : (
              <span className="hub-badge">غير مضاف</span>
            )}
          </div>
          <p>{s.description}</p>
          <div className="hub-source-fields">
            {f
              ? f.name +
                " · " +
                number(f.result.valid.length) +
                " سجل" +
                (f.origin === "demo" ? " · عينة توضيحية" : "")
              : "المطلوب: " +
                s.required.map((k) => fields[k][0]).join("، ") +
                (t === "costs" ? "، التكلفة" : "")}
          </div>
          <div className="hub-source-footer">
            <button
              className="hub-secondary"
              onClick={() => (f ? setDetail(f) : openImport(t))}
            >
              {f ? "مراجعة الملف" : "إضافة البيانات"}
            </button>
            <button className="text-button" onClick={() => download(t)}>
              تحميل القالب
            </button>
          </div>
        </article>
      );
    }),
    "file-count": number(files.length) + " ملفات",
    "file-log": loading ? (
      <div className="hub-log-loading" aria-label="جاري تجهيز مركز البيانات">
        <span className="skeleton-bar" />
        <span className="skeleton-bar" />
        <span className="skeleton-bar" />
      </div>
    ) : !files.length ? (
      <div className="hub-empty">
        <Icon name="file" />
        <h3>أول خطوة: ملف واحد</h3>
        <p>أضف ملفك، أو جرّب عينة جاهزة لتتعرف على التجربة.</p>
        <button className="hub-secondary" onClick={() => openImport("sales")}>
          إضافة أول ملف
        </button>
      </div>
    ) : (
      <table className="hub-file-table">
        <thead>
          <tr>
            {[
              "اسم الملف",
              "المصدر",
              "الفترة",
              "السجلات",
              "الحالة",
              "وقت التجهيز",
            ].map((t) => (
              <th key={t} scope="col">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...files].reverse().map((f) => (
            <tr key={f.id}>
              <td data-label="اسم الملف">
                <div>
                  <button
                    className="hub-file-name"
                    onClick={() => setDetail(f)}
                  >
                    {f.name}
                  </button>
                  <small>
                    {f.origin === "demo" ? "عينة توضيحية" : "ملف من جهازك"} ·
                    مؤقت
                  </small>
                </div>
              </td>
              <td data-label="المصدر">{schemas[f.type].label}</td>
              <td data-label="الفترة">{monthName(f.result.period)}</td>
              <td data-label="السجلات">{number(f.result.valid.length)}</td>
              <td data-label="الحالة">
                <Badge result={f.result} />
              </td>
              <td data-label="وقت التجهيز">{time(f.preparedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
    "import-error": error,
    "picked-file": picked,
    "mapping-note": schemas[draft?.type || type].note,
    "mapping-fields": draft?.parsed
      ? schemas[draft.type || type].fields.map((k) => (
          <div key={k} className="hub-map-field" id={"field-" + k}>
            <label htmlFor={"map-" + k}>
              {fields[k][0]}
              {schemas[draft.type || type].required.includes(k) ? " *" : ""}
            </label>
            <Select
              id={"map-" + k}
              aria-label={"عمود " + fields[k][0]}
              value={String(mapping[k] ?? -1)}
              onChange={(e) =>
                setMapping({ ...mapping, [k]: Number(e.target.value) })
              }
            >
              <option value="-1">لا يوجد / تجاهل</option>
              {draft.parsed.headers.map((h, i) => (
                <option key={i} value={String(i)}>
                  {h}
                </option>
              ))}
            </Select>
          </div>
        ))
      : null,
    "raw-preview": draft?.parsed ? (
      <PreviewTable headers={draft.parsed.headers} rows={draft.parsed.rows} />
    ) : null,
    "review-summary": draft?.result
      ? [
          [draft.result.valid.length, "سجلات مقبولة"],
          [draft.result.invalid.length, "سجلات غير صالحة"],
          [warnCount(draft.result), "ملاحظات للمراجعة"],
        ].map(([n, label]) => (
          <div key={label}>
            <strong>{number(n)}</strong>
            <span>{label}</span>
          </div>
        ))
      : null,
    "review-issues": draft?.result ? <Issues result={draft.result} /> : null,
    "confirm-summary": draft?.result ? <FileSummary file={draft} /> : null,
    "replace-warning": existing
      ? "يوجد ملف «" +
        existing.name +
        "» لهذا المصدر في " +
        monthName(existing.result.period) +
        ". سيتم استبدال سجلاته الـ" +
        number(existing.result.valid.length) +
        " بالسجلات المقبولة من الملف الجديد، دون جمع الملفين. التحليلات التجريبية لا تتغير."
      : "",
    "import-back": step === 1 ? "إلغاء" : "السابق",
    "import-next": [
      "مطابقة الأعمدة",
      "فحص البيانات",
      "متابعة للتأكيد",
      "تجهيز الملف للربط",
    ][step - 1],
    "step-caption": "الخطوة " + number(step) + " من ٤",
    "file-title": detail?.name || "",
    "file-details": (
      <FileDetails
        file={detail}
        onReplace={(f) => {
          setPeriod(f.result.period);
          setDetail(null);
          openImport(f.type);
        }}
      />
    ),
    "hub-status": toast,
    "hub-toast": toast,
  };
  return (
    <View
      active="data-hub"
      slots={slots}
      refs={{
        ...w.refs,
        "file-input": fileInput,
        "import-dialog": dialog,
        "import-error": errorRef,
      }}
      bindings={{
        ...w.bindings,
        "meeting-upload-banner": { hidden: !meetingFlow },
        "meeting-cancel": { href: "dashboard.html?month=" + month },
        "enter-meeting": {
          disabled: !shown.length,
          onClick: () => {
            try {
              JadwaSession.save(files);
              location.href =
                "meeting.html?month=" +
                month +
                "&period=" +
                activePeriod +
                "&mode=files";
            } catch (e) {
              showToast(e.message);
            }
          },
        },
        "hub-period": {
          value: activePeriod,
          onChange: (e) => setPeriod(e.target.value),
        },
        "try-demo": { onClick: demo },
        "data-upload:sales": { onClick: () => openImport("sales") },
        "import-dialog": { open, onClose: closeImport },
        "close-import": { onClick: closeImport },
        "import-type": {
          value: type,
          onChange: (e) => setType(e.target.value),
        },
        "pick-file": {
          disabled: reading,
          onClick: () => fileInput.current?.click(),
        },
        "file-input": {
          onChange: (e) => {
            const f = e.target.files[0];
            e.target.value = "";
            readFile(f);
          },
        },
        "drop-zone": {
          className: "hub-drop" + (drag ? " dragover" : ""),
          onDragOver: (e) => {
            e.preventDefault();
            setDrag(true);
          },
          onDragLeave: () => setDrag(false),
          onDrop: (e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files.length !== 1) {
              setError("أضف ملفًا واحدًا في كل مرة.");
              return;
            }
            readFile(e.dataTransfer.files[0]);
          },
        },
        "wizard-template": { onClick: () => download(type) },
        "read-progress": { hidden: !reading },
        "import-error": { hidden: !error },
        ...Object.fromEntries(
          [1, 2, 3, 4].map((n) => ["data-step:" + n, { hidden: step !== n }]),
        ),
        "exclude-wrap": { hidden: !draft?.result?.invalid.length },
        "warnings-wrap": { hidden: !draft?.result || !warnCount(draft.result) },
        "exclude-invalid": {
          checked: exclude,
          onChange: (e) => setExclude(e.target.checked),
        },
        "ack-warnings": {
          checked: ack,
          onChange: (e) => setAck(e.target.checked),
        },
        "confirm-replace": {
          checked: replace,
          onChange: (e) => setReplace(e.target.checked),
        },
        "replace-wrap": { hidden: !existing },
        "replace-warning": { hidden: !existing },
        "import-back": {
          onClick: () => (step === 1 ? closeImport() : changeStep(step - 1)),
        },
        "import-next": {
          onClick: next,
          disabled:
            reading ||
            (step === 1 && !draft?.parsed) ||
            (step === 3 && !draft?.result?.valid.length),
        },
        "file-dialog": { open: !!detail, onClose: () => setDetail(null) },
        "close-file": { onClick: () => setDetail(null) },
        "hub-toast": { hidden: !toast },
        ".hub-steps": {
          children: [
            "اختيار الملف",
            "مطابقة الأعمدة",
            "مراجعة البيانات",
            "التأكيد",
          ].map((text, i) => (
            <li key={text} aria-current={i + 1 === step ? "step" : undefined}>
              {text}
            </li>
          )),
        },
      }}
    />
  );
}
