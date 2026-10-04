import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function DataHubView({
  slots = {},
  bindings = {},
  refs = {},
  active,
  loading = false,
}) {
  return (
    <>
      <IconDefinitions />
      <Sidebar active={active} bindings={bindings} />
      <main>
        <header className={"topbar"} {...bindings[".topbar"]}>
          <div className={"breadcrumb"} {...bindings[".breadcrumb"]}>
            <button
              className={"icon-button mobile-menu"}
              aria-label={"فتح القائمة"}
              aria-expanded={"false"}
              id={"menu-button"}
              {...bindings[".mobile-menu"]}
              {...bindings[".icon-button"]}
              {...bindings["menu-button"]}
              ref={refs["menu-button"]}
            >
              {Object.hasOwn(slots, "menu-button") ? (
                slots["menu-button"]
              ) : (
                <>
                  <svg>
                    <use href={"#menu"} />
                  </svg>
                </>
              )}
            </button>
            <svg>
              <use href={"#home"} />
            </svg>
            <a
              href={"dashboard.html"}
              data-home={""}
              {...bindings["data-home"]}
            >
              {"الرئيسية"}
            </a>
            <span className={"slash"} {...bindings[".slash"]}>
              {"/"}
            </span>
            <b>{"مركز البيانات"}</b>
          </div>
          <div className={"topbar-left"} {...bindings[".topbar-left"]}>
            <span className={"demo-label"} {...bindings[".demo-label"]}>
              {"بيانات التحليلات: تجريبية"}
            </span>
            <span className={"mini-avatar"} {...bindings[".mini-avatar"]}>
              {"ش"}
            </span>
          </div>
        </header>
        <div
          className={"page-content hub-page"}
          {...bindings[".hub-page"]}
          {...bindings[".page-content"]}
        >
          <section className={"page-heading"} {...bindings[".page-heading"]}>
            <div>
              <div className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"الصورة الأوضح تبدأ من بياناتك"}
              </div>
              <h1>{"مركز البيانات"}</h1>
              <p>{"اجمع بيانات منشأتك، وراجع جاهزيتها للتحليل."}</p>
            </div>
            <div className={"hub-actions"} {...bindings[".hub-actions"]}>
              <button
                className={"hub-secondary"}
                id={"try-demo"}
                {...bindings[".hub-secondary"]}
                {...bindings["try-demo"]}
                ref={refs["try-demo"]}
              >
                {Object.hasOwn(slots, "try-demo") ? (
                  slots["try-demo"]
                ) : (
                  <>{"تجربة بيانات جاهزة"}</>
                )}
              </button>
              <button
                className={"primary-button"}
                data-upload={"sales"}
                {...bindings[".primary-button"]}
                {...bindings["data-upload:sales"]}
              >
                <svg>
                  <use href={"#file"} />
                </svg>
                {"إضافة ملف"}
              </button>
            </div>
          </section>
          <section
            id={"meeting-upload-banner"}
            className={"meeting-upload-banner"}
            hidden={true}
            aria-labelledby={"meeting-prep-title"}
            {...bindings[".meeting-upload-banner"]}
            {...bindings["meeting-upload-banner"]}
            ref={refs["meeting-upload-banner"]}
          >
            {Object.hasOwn(slots, "meeting-upload-banner") ? (
              slots["meeting-upload-banner"]
            ) : (
              <>
                <div>
                  <h2
                    id={"meeting-prep-title"}
                    {...bindings["meeting-prep-title"]}
                    ref={refs["meeting-prep-title"]}
                  >
                    {Object.hasOwn(slots, "meeting-prep-title") ? (
                      slots["meeting-prep-title"]
                    ) : (
                      <>{"جهّزي ملفات اجتماعك"}</>
                    )}
                  </h2>
                  <p
                    id={"meeting-prep-summary"}
                    role={"status"}
                    {...bindings["meeting-prep-summary"]}
                    ref={refs["meeting-prep-summary"]}
                  >
                    {Object.hasOwn(slots, "meeting-prep-summary") ? (
                      slots["meeting-prep-summary"]
                    ) : (
                      <>{"أضيفي ملفًا وراجعيه، ثم انتقلي إلى الغرفة."}</>
                    )}
                  </p>
                </div>
                <div
                  className={"meeting-upload-actions"}
                  {...bindings[".meeting-upload-actions"]}
                >
                  <a
                    id={"meeting-cancel"}
                    href={"dashboard.html"}
                    {...bindings["meeting-cancel"]}
                    ref={refs["meeting-cancel"]}
                  >
                    {Object.hasOwn(slots, "meeting-cancel") ? (
                      slots["meeting-cancel"]
                    ) : (
                      <>{"إلغاء"}</>
                    )}
                  </a>
                  <button
                    className={"primary-button"}
                    id={"enter-meeting"}
                    disabled={true}
                    {...bindings[".primary-button"]}
                    {...bindings["enter-meeting"]}
                    ref={refs["enter-meeting"]}
                  >
                    {Object.hasOwn(slots, "enter-meeting") ? (
                      slots["enter-meeting"]
                    ) : (
                      <>{"دخول الاجتماع"}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </section>
          <div className={"hub-mode"} {...bindings[".hub-mode"]}>
            <svg>
              <use href={"#info"} />
            </svg>
            <div>
              <b>{"ملفاتك قيد التجهيز، والتحليلات ما زالت تجريبية"}</b>
              <p>
                {
                  "تُقرأ الملفات على جهازك دون رفعها لخادم. تُحفظ الملفات المجهزة مؤقتًا في هذا التبويب لتنتقلي بها إلى الاجتماع، وتبقى عند تحديث الصفحة. ربطها بالتحليلات والحفظ الدائم غير متاحين بعد."
                }
              </p>
            </div>
          </div>
          <section
            className={"hub-overview"}
            aria-label={"حالة البيانات"}
            {...bindings[".hub-overview"]}
          >
            <div className={"hub-period"} {...bindings[".hub-period"]}>
              <span>{"الفترة المعروضة"}</span>
              <label
                htmlFor={"hub-period"}
                className={"sr-only"}
                {...bindings[".sr-only"]}
              >
                {"فترة تجهيز الملفات"}
              </label>
              <Select
                id={"hub-period"}
                {...bindings["hub-period"]}
                ref={refs["hub-period"]}
              >
                {Object.hasOwn(slots, "hub-period") ? (
                  slots["hub-period"]
                ) : (
                  <>
                    <option value={"2026-09"}>{"سبتمبر ٢٠٢٦"}</option>
                    <option value={"2026-08"}>{"أغسطس ٢٠٢٦"}</option>
                  </>
                )}
              </Select>
            </div>
            <div>
              <span>{"مصادر مجهزة"}</span>
              <strong
                id={"source-count"}
                {...bindings["source-count"]}
                ref={refs["source-count"]}
              >
                {Object.hasOwn(slots, "source-count") ? (
                  slots["source-count"]
                ) : (
                  <>{"٠ من ٤"}</>
                )}
              </strong>
            </div>
            <div>
              <span>{"تحتاج مراجعة"}</span>
              <strong
                id={"review-count"}
                {...bindings["review-count"]}
                ref={refs["review-count"]}
              >
                {Object.hasOwn(slots, "review-count") ? (
                  slots["review-count"]
                ) : (
                  <>{"٠ ملفات"}</>
                )}
              </strong>
            </div>
            <div>
              <span>{"آخر تجهيز في هذه الجلسة"}</span>
              <strong
                id={"last-prepared"}
                {...bindings["last-prepared"]}
                ref={refs["last-prepared"]}
              >
                {Object.hasOwn(slots, "last-prepared") ? (
                  slots["last-prepared"]
                ) : (
                  <>{"لم تُجهّز ملفات بعد"}</>
                )}
              </strong>
            </div>
          </section>
          <div
            id={"readiness-note"}
            className={"hub-readiness"}
            role={"status"}
            {...bindings[".hub-readiness"]}
            {...bindings["readiness-note"]}
            ref={refs["readiness-note"]}
          >
            {Object.hasOwn(slots, "readiness-note") ? (
              slots["readiness-note"]
            ) : (
              <></>
            )}
          </div>
          <section aria-labelledby={"sources-title"}>
            <div
              className={"section-heading"}
              {...bindings[".section-heading"]}
            >
              <div>
                <h2
                  id={"sources-title"}
                  {...bindings["sources-title"]}
                  ref={refs["sources-title"]}
                >
                  {Object.hasOwn(slots, "sources-title") ? (
                    slots["sources-title"]
                  ) : (
                    <>{"مصادر البيانات"}</>
                  )}
                </h2>
                <p>
                  {
                    "ملف لكل مصدر وفترة شهرية. ابدأ بالمبيعات لربط رموز المنتجات."
                  }
                </p>
              </div>
              <span className={"hub-small"} {...bindings[".hub-small"]}>
                {"القوالب بصيغة CSV"}
              </span>
            </div>
            <div
              className={"hub-sources"}
              id={"source-cards"}
              {...bindings[".hub-sources"]}
              {...bindings["source-cards"]}
              ref={refs["source-cards"]}
            >
              {Object.hasOwn(slots, "source-cards") ? (
                slots["source-cards"]
              ) : (
                <></>
              )}
            </div>
          </section>
          <section
            className={"hub-files-section"}
            aria-labelledby={"files-title"}
            {...bindings[".hub-files-section"]}
          >
            <div
              className={"section-heading"}
              {...bindings[".section-heading"]}
            >
              <div>
                <h2
                  id={"files-title"}
                  {...bindings["files-title"]}
                  ref={refs["files-title"]}
                >
                  {Object.hasOwn(slots, "files-title") ? (
                    slots["files-title"]
                  ) : (
                    <>{"سجل الملفات"}</>
                  )}
                </h2>
                <p>{"الملفات التي جُهزت في هذه الجلسة فقط."}</p>
              </div>
              <span
                id={"file-count"}
                className={"section-count"}
                {...bindings[".section-count"]}
                {...bindings["file-count"]}
                ref={refs["file-count"]}
              >
                {Object.hasOwn(slots, "file-count") ? (
                  slots["file-count"]
                ) : (
                  <>{"٠ ملفات"}</>
                )}
              </span>
            </div>
            <div
              id={"file-log"}
              className={"hub-log"}
              {...bindings[".hub-log"]}
              {...bindings["file-log"]}
              ref={refs["file-log"]}
            >
              {Object.hasOwn(slots, "file-log") ? slots["file-log"] : <></>}
            </div>
          </section>
          <footer className={"page-footer"} {...bindings[".page-footer"]}>
            <span>
              {"جدوى "}
              <span
                className={"footer-divider"}
                {...bindings[".footer-divider"]}
              >
                {"/"}
              </span>
              {" قرارات أوضح، رؤية أذكى"}
            </span>
            <span>{"تجهيز الملفات · نسخة تجريبية"}</span>
          </footer>
        </div>
      </main>
      <Dialog
        id={"import-dialog"}
        className={"hub-dialog"}
        aria-labelledby={"import-title"}
        {...bindings[".hub-dialog"]}
        {...bindings["import-dialog"]}
        ref={refs["import-dialog"]}
      >
        {Object.hasOwn(slots, "import-dialog") ? (
          slots["import-dialog"]
        ) : (
          <>
            <div
              className={"hub-dialog-header"}
              {...bindings[".hub-dialog-header"]}
            >
              <div>
                <span
                  className={"dialog-eyebrow"}
                  {...bindings[".dialog-eyebrow"]}
                >
                  {"مركز البيانات"}
                </span>
                <h2
                  id={"import-title"}
                  {...bindings["import-title"]}
                  ref={refs["import-title"]}
                >
                  {Object.hasOwn(slots, "import-title") ? (
                    slots["import-title"]
                  ) : (
                    <>{"إضافة ملف"}</>
                  )}
                </h2>
              </div>
              <button
                className={"icon-button"}
                id={"close-import"}
                aria-label={"إغلاق رفع الملف"}
                {...bindings[".icon-button"]}
                {...bindings["close-import"]}
                ref={refs["close-import"]}
              >
                {Object.hasOwn(slots, "close-import") ? (
                  slots["close-import"]
                ) : (
                  <>
                    <svg>
                      <use href={"#close"} />
                    </svg>
                  </>
                )}
              </button>
            </div>
            <ol className="hub-steps" aria-label="خطوات تجهيز الملف">
              {slots["hub-steps"]}
            </ol>
            <div
              className={"hub-dialog-body"}
              {...bindings[".hub-dialog-body"]}
            >
              <div
                id={"import-error"}
                className={"hub-error"}
                role={"alert"}
                hidden={true}
                {...bindings[".hub-error"]}
                {...bindings["import-error"]}
                ref={refs["import-error"]}
              >
                {Object.hasOwn(slots, "import-error") ? (
                  slots["import-error"]
                ) : (
                  <></>
                )}
              </div>
              <section data-step={"1"} {...bindings["data-step:1"]}>
                <div className={"hub-field"} {...bindings[".hub-field"]}>
                  <label htmlFor={"import-type"}>{"نوع البيانات"}</label>
                  <Select
                    id={"import-type"}
                    {...bindings["import-type"]}
                    ref={refs["import-type"]}
                  >
                    {Object.hasOwn(slots, "import-type") ? (
                      slots["import-type"]
                    ) : (
                      <>
                        <option value={"sales"}>{"المبيعات"}</option>
                        <option value={"costs"}>{"تكلفة المنتجات"}</option>
                        <option value={"inventory"}>{"المخزون والهدر"}</option>
                        <option value={"expenses"}>{"المصروفات"}</option>
                      </>
                    )}
                  </Select>
                </div>
                <div
                  className={"hub-drop"}
                  id={"drop-zone"}
                  {...bindings[".hub-drop"]}
                  {...bindings["drop-zone"]}
                  ref={refs["drop-zone"]}
                >
                  {Object.hasOwn(slots, "drop-zone") ? (
                    slots["drop-zone"]
                  ) : (
                    <>
                      <svg>
                        <use href={"#file"} />
                      </svg>
                      <h3>{"اسحب ملفك هنا"}</h3>
                      <p>{"CSV بترميز UTF-8 · حتى ٥ ميجابايت و١٠٬٠٠٠ سجل"}</p>
                      <button
                        className={"hub-secondary"}
                        id={"pick-file"}
                        {...bindings[".hub-secondary"]}
                        {...bindings["pick-file"]}
                        ref={refs["pick-file"]}
                      >
                        {Object.hasOwn(slots, "pick-file") ? (
                          slots["pick-file"]
                        ) : (
                          <>{"اختيار ملف من الجهاز"}</>
                        )}
                      </button>
                      <input
                        type={"file"}
                        id={"file-input"}
                        accept={".csv,text/csv"}
                        hidden={true}
                        {...bindings["file-input"]}
                        ref={refs["file-input"]}
                      />
                      <p
                        id={"picked-file"}
                        role={"status"}
                        {...bindings["picked-file"]}
                        ref={refs["picked-file"]}
                      >
                        {Object.hasOwn(slots, "picked-file") ? (
                          slots["picked-file"]
                        ) : (
                          <>{"ملف واحد في كل مرة"}</>
                        )}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={"hub-template-note"}
                  {...bindings[".hub-template-note"]}
                >
                  <span>{"ما عندك ملف بالصيغة المناسبة؟"}</span>
                  <button
                    className={"text-button"}
                    id={"wizard-template"}
                    {...bindings[".text-button"]}
                    {...bindings["wizard-template"]}
                    ref={refs["wizard-template"]}
                  >
                    {Object.hasOwn(slots, "wizard-template") ? (
                      slots["wizard-template"]
                    ) : (
                      <>{"حمّل قالب هذا المصدر"}</>
                    )}
                  </button>
                </div>
                <p className={"hub-small"} {...bindings[".hub-small"]}>
                  {
                    "صدّر ملف Excel بصيغة CSV UTF-8. استخدم تاريخًا مثل 2026-09-01 ومبالغ غير شاملة الضريبة. هذه الخطوة تقرأ الملف فقط ولا تحدّث تحليلاتك."
                  }
                </p>
                <div
                  id={"read-progress"}
                  className={"hub-read-progress"}
                  hidden={true}
                  aria-live={"polite"}
                  {...bindings[".hub-read-progress"]}
                  {...bindings["read-progress"]}
                  ref={refs["read-progress"]}
                >
                  {Object.hasOwn(slots, "read-progress") ? (
                    slots["read-progress"]
                  ) : (
                    <>
                      <span
                        className={"skeleton-bar"}
                        {...bindings[".skeleton-bar"]}
                      ></span>
                      <p>{"جاري قراءة الملف…"}</p>
                    </>
                  )}
                </div>
              </section>
              <section
                data-step={"2"}
                hidden={true}
                {...bindings["data-step:2"]}
              >
                <h3>{"طابق أعمدة ملفك"}</h3>
                <p className={"hub-muted"} {...bindings[".hub-muted"]}>
                  {
                    "اقترحنا التطابقات حسب أسماء الأعمدة؛ راجعها قبل المتابعة. الحقول بعلامة * مطلوبة."
                  }
                </p>
                <p
                  id={"mapping-note"}
                  className={"hub-small"}
                  {...bindings[".hub-small"]}
                  {...bindings["mapping-note"]}
                  ref={refs["mapping-note"]}
                >
                  {Object.hasOwn(slots, "mapping-note") ? (
                    slots["mapping-note"]
                  ) : (
                    <></>
                  )}
                </p>
                <div
                  id={"mapping-fields"}
                  className={"hub-mapping"}
                  {...bindings[".hub-mapping"]}
                  {...bindings["mapping-fields"]}
                  ref={refs["mapping-fields"]}
                >
                  {Object.hasOwn(slots, "mapping-fields") ? (
                    slots["mapping-fields"]
                  ) : (
                    <></>
                  )}
                </div>
                <h3>{"معاينة أول خمسة سجلات"}</h3>
                <div
                  id={"raw-preview"}
                  className={"hub-table-scroll"}
                  {...bindings[".hub-table-scroll"]}
                  {...bindings["raw-preview"]}
                  ref={refs["raw-preview"]}
                >
                  {Object.hasOwn(slots, "raw-preview") ? (
                    slots["raw-preview"]
                  ) : (
                    <></>
                  )}
                </div>
              </section>
              <section
                data-step={"3"}
                hidden={true}
                {...bindings["data-step:3"]}
              >
                <h3>{"راجع نتيجة الفحص"}</h3>
                <div
                  id={"review-summary"}
                  className={"hub-review-summary"}
                  {...bindings[".hub-review-summary"]}
                  {...bindings["review-summary"]}
                  ref={refs["review-summary"]}
                >
                  {Object.hasOwn(slots, "review-summary") ? (
                    slots["review-summary"]
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  id={"review-issues"}
                  {...bindings["review-issues"]}
                  ref={refs["review-issues"]}
                >
                  {Object.hasOwn(slots, "review-issues") ? (
                    slots["review-issues"]
                  ) : (
                    <></>
                  )}
                </div>
                <label
                  className={"hub-consent"}
                  id={"exclude-wrap"}
                  hidden={true}
                  {...bindings[".hub-consent"]}
                  {...bindings["exclude-wrap"]}
                  ref={refs["exclude-wrap"]}
                >
                  {Object.hasOwn(slots, "exclude-wrap") ? (
                    slots["exclude-wrap"]
                  ) : (
                    <>
                      <input
                        type={"checkbox"}
                        id={"exclude-invalid"}
                        {...bindings["exclude-invalid"]}
                        ref={refs["exclude-invalid"]}
                      />
                      <span>
                        {
                          "أوافق على استبعاد السجلات غير الصالحة الموضحة، وتجهيز السجلات المقبولة فقط."
                        }
                      </span>
                    </>
                  )}
                </label>
                <label
                  className={"hub-consent"}
                  id={"warnings-wrap"}
                  hidden={true}
                  {...bindings[".hub-consent"]}
                  {...bindings["warnings-wrap"]}
                  ref={refs["warnings-wrap"]}
                >
                  {Object.hasOwn(slots, "warnings-wrap") ? (
                    slots["warnings-wrap"]
                  ) : (
                    <>
                      <input
                        type={"checkbox"}
                        id={"ack-warnings"}
                        {...bindings["ack-warnings"]}
                        ref={refs["ack-warnings"]}
                      />
                      <span>
                        {
                          "راجعت الملاحظات. أحتفظ بالسجلات المتشابهة دون حذف تلقائي، وسأراجع الربط قبل استخدامها في التحليل."
                        }
                      </span>
                    </>
                  )}
                </label>
              </section>
              <section
                data-step={"4"}
                hidden={true}
                {...bindings["data-step:4"]}
              >
                <h3>{"تأكيد تجهيز الملف"}</h3>
                <div
                  id={"confirm-summary"}
                  {...bindings["confirm-summary"]}
                  ref={refs["confirm-summary"]}
                >
                  {Object.hasOwn(slots, "confirm-summary") ? (
                    slots["confirm-summary"]
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  id={"replace-warning"}
                  className={"hub-warning"}
                  hidden={true}
                  {...bindings[".hub-warning"]}
                  {...bindings["replace-warning"]}
                  ref={refs["replace-warning"]}
                >
                  {Object.hasOwn(slots, "replace-warning") ? (
                    slots["replace-warning"]
                  ) : (
                    <></>
                  )}
                </div>
                <label
                  className={"hub-consent"}
                  id={"replace-wrap"}
                  hidden={true}
                  {...bindings[".hub-consent"]}
                  {...bindings["replace-wrap"]}
                  ref={refs["replace-wrap"]}
                >
                  {Object.hasOwn(slots, "replace-wrap") ? (
                    slots["replace-wrap"]
                  ) : (
                    <>
                      <input
                        type={"checkbox"}
                        id={"confirm-replace"}
                        {...bindings["confirm-replace"]}
                        ref={refs["confirm-replace"]}
                      />
                      <span>
                        {
                          "أوافق على استبدال الملف المجهز سابقًا لهذا المصدر والشهر داخل هذه الجلسة."
                        }
                      </span>
                    </>
                  )}
                </label>
                <div
                  className={"hub-mode compact"}
                  {...bindings[".compact"]}
                  {...bindings[".hub-mode"]}
                >
                  <svg>
                    <use href={"#info"} />
                  </svg>
                  <p>
                    {
                      "التأكيد يجهّز الملف للربط فقط. أرقام الرئيسية والفرص والمنتجات والمصروفات لن تتغير."
                    }
                  </p>
                </div>
              </section>
            </div>
            <div
              className={"hub-dialog-footer"}
              {...bindings[".hub-dialog-footer"]}
            >
              <button
                className={"hub-secondary"}
                id={"import-back"}
                {...bindings[".hub-secondary"]}
                {...bindings["import-back"]}
                ref={refs["import-back"]}
              >
                {Object.hasOwn(slots, "import-back") ? (
                  slots["import-back"]
                ) : (
                  <>{"إلغاء"}</>
                )}
              </button>
              <span
                id={"step-caption"}
                role={"status"}
                aria-live={"polite"}
                {...bindings["step-caption"]}
                ref={refs["step-caption"]}
              >
                {Object.hasOwn(slots, "step-caption") ? (
                  slots["step-caption"]
                ) : (
                  <>{"الخطوة ١ من ٤"}</>
                )}
              </span>
              <button
                className={"primary-button"}
                id={"import-next"}
                {...bindings[".primary-button"]}
                {...bindings["import-next"]}
                ref={refs["import-next"]}
              >
                {Object.hasOwn(slots, "import-next") ? (
                  slots["import-next"]
                ) : (
                  <>{"مطابقة الأعمدة"}</>
                )}
              </button>
            </div>
          </>
        )}
      </Dialog>
      <Dialog
        id={"file-dialog"}
        className={"hub-dialog"}
        aria-labelledby={"file-title"}
        {...bindings[".hub-dialog"]}
        {...bindings["file-dialog"]}
        ref={refs["file-dialog"]}
      >
        {Object.hasOwn(slots, "file-dialog") ? (
          slots["file-dialog"]
        ) : (
          <>
            <div
              className={"hub-dialog-header"}
              {...bindings[".hub-dialog-header"]}
            >
              <div>
                <span
                  className={"dialog-eyebrow"}
                  {...bindings[".dialog-eyebrow"]}
                >
                  {"تفاصيل الملف"}
                </span>
                <h2
                  id={"file-title"}
                  {...bindings["file-title"]}
                  ref={refs["file-title"]}
                >
                  {Object.hasOwn(slots, "file-title") ? (
                    slots["file-title"]
                  ) : (
                    <></>
                  )}
                </h2>
              </div>
              <button
                className={"icon-button"}
                id={"close-file"}
                aria-label={"إغلاق تفاصيل الملف"}
                {...bindings[".icon-button"]}
                {...bindings["close-file"]}
                ref={refs["close-file"]}
              >
                {Object.hasOwn(slots, "close-file") ? (
                  slots["close-file"]
                ) : (
                  <>
                    <svg>
                      <use href={"#close"} />
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div
              id={"file-details"}
              className={"hub-dialog-body"}
              {...bindings[".hub-dialog-body"]}
              {...bindings["file-details"]}
              ref={refs["file-details"]}
            >
              {Object.hasOwn(slots, "file-details") ? (
                slots["file-details"]
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </Dialog>
      <p
        id={"hub-status"}
        className={"sr-only"}
        role={"status"}
        aria-live={"polite"}
        {...bindings[".sr-only"]}
        {...bindings["hub-status"]}
        ref={refs["hub-status"]}
      >
        {Object.hasOwn(slots, "hub-status") ? slots["hub-status"] : <></>}
      </p>
      <div
        id={"hub-toast"}
        className={"hub-toast"}
        role={"status"}
        hidden={true}
        {...bindings[".hub-toast"]}
        {...bindings["hub-toast"]}
        ref={refs["hub-toast"]}
      >
        {Object.hasOwn(slots, "hub-toast") ? slots["hub-toast"] : <></>}
      </div>
    </>
  );
}
