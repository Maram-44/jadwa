import { useRef, useState, useEffect } from "react";
import { mountRoom } from "./renderer/adapter.js";
import { JadwaSession } from "../../shared/lib/session.js";
import { number } from "../../shared/ui/primitives.jsx";
export default function MeetingPage() {
  const params = new URLSearchParams(location.search),
    month = params.get("month") === "aug" ? "aug" : "sep",
    period = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.get("period") || "")
      ? params.get("period")
      : JadwaSession.periodFor(month),
    periodName = new Intl.DateTimeFormat("ar-SA", {
      month: "long",
      year: "numeric",
      calendar: "gregory",
      timeZone: "UTC",
    }).format(new Date(period + "-01T00:00:00Z"));
  const [files] = useState(() =>
      params.get("mode") === "demo" ? [] : JadwaSession.forPeriod(period),
    ),
    [state, setState] = useState({
      loading: true,
      failed: false,
      ready: false,
      angle: 0,
      cradle: false,
      motion: false,
      dragging: false,
      status: "جارٍ تجهيز المعاينة",
    }),
    canvas = useRef(),
    room = useRef(),
    logo = useRef(),
    adapter = useRef();
  useEffect(() => {
    const engine = mountRoom({
      canvas: canvas.current,
      room: room.current,
      logo: logo.current,
      onState: (patch) => setState((s) => ({ ...s, ...patch })),
    });
    adapter.current = engine;
    return () => {
      engine.dispose();
      if (adapter.current === engine) adapter.current = null;
    };
  }, []);
  const names = {
    sales: "المبيعات",
    costs: "تكلفة المنتجات",
    inventory: "المخزون والهدر",
    expenses: "المصروفات",
  };
  async function expand() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (room.current.requestFullscreen)
        await room.current.requestFullscreen();
      else throw Error();
    } catch {
      setState((s) => ({ ...s, status: "ملء الشاشة غير متاح هنا" }));
    }
  }
  return (
    <>
      <header>
        <div className="brand">
          <div className="logo">
            <img ref={logo} src="/assets/jadwa-logo.png" alt="جدوى" />
          </div>
          <span>اجتماع مع جدوى</span>
        </div>
        <a
          className="meeting-back"
          id="meeting-back"
          href={"dashboard.html?month=" + month}
        >
          العودة للمشروع
        </a>
      </header>
      <main>
        <div className="meeting-toolbar">
          <div>
            <h1>اجتماع مع جدوى</h1>
            <p id="meeting-context" role="status">
              {files.length
                ? number(files.length) + " ملفات مرفقة · " + periodName
                : params.get("mode") === "files"
                  ? "الملفات السابقة غير متاحة في هذا التبويب. أضيفيها مجددًا من «تغيير الملفات»."
                  : "بيانات توضيحية · " + periodName}
            </p>
          </div>
          <a
            id="meeting-edit-files"
            href={
              "data-hub.html?month=" +
              month +
              "&return=meeting&period=" +
              period
            }
          >
            تغيير الملفات
          </a>
        </div>
        <section
          className="room"
          id="room"
          ref={room}
          aria-label="غرفة اجتماع جدوى ثلاثية الأبعاد"
        >
          <canvas
            id="scene"
            ref={canvas}
            className={state.dragging ? "dragging" : ""}
            tabIndex={0}
            aria-label="المكان ثلاثي الأبعاد. استخدم أسهم الاتجاهات للنظر حولك ومفتاح صفر للعودة."
          />
          <div
            className={"loader" + (state.loading ? "" : " hidden")}
            id="loader"
            role="status"
          >
            نجهّز لك المكان…
          </div>
          <div
            className={"fallback" + (state.failed ? "" : " hidden")}
            id="fallback"
            style={{ backgroundImage: "url('/room/layout-camera.jpg')" }}
          >
            <p>
              جهازك لا يتيح العرض ثلاثي الأبعاد هنا؛ هذه معاينة ثابتة للتوزيع.
            </p>
          </div>
          <div className="room-top">
            <span className="pill">
              <b>غرفة جدوى</b> · من مقعدك
            </span>
            <div className="room-actions">
              <button
                className="icon"
                id="reset"
                title="إعادة زاوية النظر"
                aria-label="إعادة زاوية النظر"
                disabled={!state.ready}
                onClick={() => adapter.current?.reset()}
              >
                ↺
              </button>
              <button
                className="icon"
                id="expand"
                title="ملء الشاشة"
                aria-label="ملء الشاشة"
                onClick={expand}
              >
                ⛶
              </button>
            </div>
          </div>
          <div className={"hint" + (state.failed ? " hidden" : "")} id="hint">
            اسحب للنظر حولك وفوق وتحت
          </div>
        </section>
        <div className="controls">
          <div className="views" aria-label="زوايا المكان">
            {[
              [0, "من مكاني"],
              [-0.1, "نحو اليسار"],
              [0.1, "نحو اليمين"],
            ].map(([a, label]) => (
              <button
                key={a}
                data-angle={a}
                aria-pressed={Math.abs(a - state.angle) < 0.015}
                disabled={!state.ready}
                onClick={() =>
                  a === 0
                    ? adapter.current?.reset()
                    : adapter.current?.setAngle(a)
                }
              >
                {label}
              </button>
            ))}
            <button
              id="cradle-toggle"
              aria-pressed={state.cradle}
              disabled={!state.ready || !state.hasCradle}
              onClick={() => adapter.current?.toggleCradle()}
            >
              {state.cradle ? "إيقاف الحركة" : "حرّك كرات نيوتن"}
            </button>
            <button
              id="motion-toggle"
              aria-pressed={state.motion}
              disabled={!state.ready}
              onClick={() => adapter.current?.toggleMotion()}
            >
              {state.motion ? "إيقاف الحركة الهادئة" : "تشغيل الحركة الهادئة"}
            </button>
          </div>
          <div className="look">
            <label htmlFor="angle">زاوية النظر</label>
            <input
              id="angle"
              type="range"
              min="-12"
              max="12"
              value={Math.round((state.angle * 180) / Math.PI)}
              aria-valuetext={
                Math.abs(state.angle) < 0.015
                  ? "المنتصف"
                  : state.angle < 0
                    ? "نحو اليسار"
                    : "نحو اليمين"
              }
              disabled={!state.ready}
              onChange={(e) =>
                adapter.current?.setAngle(
                  (Number(e.target.value) * Math.PI) / 180,
                )
              }
            />
            <span className="status" id="status" role="status">
              {state.status}
            </span>
          </div>
        </div>
        <details className="meeting-attached">
          <summary id="meeting-files-title">
            {files.length
              ? "ملفات الاجتماع (" + number(files.length) + ")"
              : "ملفات الاجتماع"}
          </summary>
          <div id="meeting-attachments">
            {files.length ? (
              <>
                {files.map((file) => (
                  <div key={file.id} className="meeting-attachment">
                    <b>{file.name}</b>
                    <span>
                      {names[file.type] +
                        " · " +
                        number(file.result.valid.length) +
                        " سجل مقبول" +
                        (file.origin === "demo" ? " · عينة توضيحية" : "") +
                        (file.result.issues.some((i) => i.level === "warning")
                          ? " · توجد ملاحظات للمراجعة"
                          : "")}
                    </span>
                  </div>
                ))}
                <p>
                  مرفقة لهذه الجلسة من التخزين المؤقت في تبويبك. لم تُرسل إلى
                  نموذج ذكاء اصطناعي.
                </p>
              </>
            ) : (
              <p>
                لا توجد ملفات مرفقة للاجتماع. يمكنك استكشاف الغرفة أو إضافة
                ملفات من مركز البيانات.
              </p>
            )}
          </div>
        </details>
        <p className="meeting-availability">
          الغرفة والشخصية متاحتان للمعاينة. المحادثة الصوتية وتحليل الملفات
          بالذكاء الاصطناعي غير مفعّلين بعد.
        </p>
      </main>
    </>
  );
}
