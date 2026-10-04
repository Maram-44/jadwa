import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function OpportunitiesView({
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
            <b>{"فرص التحسين"}</b>
          </div>
          <div className={"topbar-left"} {...bindings[".topbar-left"]}>
            <span className={"demo-label"} {...bindings[".demo-label"]}>
              {"بيانات توضيحية"}
            </span>
            <span className={"mini-avatar"} {...bindings[".mini-avatar"]}>
              {"ش"}
            </span>
          </div>
        </header>
        <div
          className={"page-content opportunities-page"}
          {...bindings[".opportunities-page"]}
          {...bindings[".page-content"]}
        >
          <section className={"page-heading"} {...bindings[".page-heading"]}>
            <div>
              <div className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"خطوتك التالية نحو ربحية أفضل"}
              </div>
              <h1>{"فرص التحسين"}</h1>
              <p>{"إجراءات مقترحة، وأثر تقديري يمكنك مراجعته."}</p>
            </div>
            <div className={"period-select"} {...bindings[".period-select"]}>
              <svg>
                <use href={"#calendar"} />
              </svg>
              <label
                className={"sr-only"}
                htmlFor={"period"}
                {...bindings[".sr-only"]}
              >
                {"الفترة"}
              </label>
              <Select
                id={"period"}
                {...bindings["period"]}
                ref={refs["period"]}
              >
                {Object.hasOwn(slots, "period") ? (
                  slots["period"]
                ) : (
                  <>
                    <option value={"sep"}>{"سبتمبر ٢٠٢٦"}</option>
                    <option value={"aug"}>{"أغسطس ٢٠٢٦"}</option>
                  </>
                )}
              </Select>
              <svg
                className={"select-chevron"}
                {...bindings[".select-chevron"]}
              >
                <use href={"#chevron"} />
              </svg>
            </div>
          </section>
          <div className={"workflow-note"} {...bindings[".workflow-note"]}>
            <svg>
              <use href={"#info"} />
            </svg>
            <span>
              {
                "المتابعة تجريبية لهذه الجلسة فقط؛ تُعاد عند تحديث الصفحة أو مغادرتها."
              }
            </span>
          </div>
          <section
            className={"opportunity-summary"}
            aria-label={"ملخص فرص التحسين"}
            {...bindings[".opportunity-summary"]}
          >
            <article
              className={
                "summary-card featured" + (loading ? " is-loading" : "")
              }
              {...bindings[".featured"]}
              {...bindings[".summary-card"]}
              inert={loading}
            >
              <div className={"summary-label"} {...bindings[".summary-label"]}>
                <svg>
                  <use href={"#spark"} />
                </svg>
                <span>{"إجمالي الوفر المحتمل"}</span>
                <span className={"estimate"} {...bindings[".estimate"]}>
                  {"تقديري"}
                </span>
              </div>
              <div
                className={"summary-number"}
                {...bindings[".summary-number"]}
              >
                <strong
                  id={"potential-value"}
                  {...bindings["potential-value"]}
                  ref={refs["potential-value"]}
                >
                  {Object.hasOwn(slots, "potential-value") ? (
                    slots["potential-value"]
                  ) : (
                    <>{"٢٬٥٠٠"}</>
                  )}
                </strong>
                <span
                  className={"riyal-symbol"}
                  role={"img"}
                  aria-label={"ريال سعودي"}
                  {...bindings[".riyal-symbol"]}
                ></span>
              </div>
              <p>{"للفرص المفتوحة في الفترة المحددة"}</p>
              {loading && <Skeleton />}
            </article>
            <article
              className={"summary-card" + (loading ? " is-loading" : "")}
              {...bindings[".summary-card"]}
              inert={loading}
            >
              <div className={"summary-label"} {...bindings[".summary-label"]}>
                <svg>
                  <use href={"#file"} />
                </svg>
                {"تحتاج مراجعتك"}
              </div>
              <div
                className={"summary-number"}
                {...bindings[".summary-number"]}
              >
                <strong
                  id={"new-count"}
                  {...bindings["new-count"]}
                  ref={refs["new-count"]}
                >
                  {Object.hasOwn(slots, "new-count") ? (
                    slots["new-count"]
                  ) : (
                    <>{"٣"}</>
                  )}
                </strong>
                <span>{"فرص"}</span>
              </div>
              <p>{"ابدئي بالفرصة الأعلى أثرًا"}</p>
              {loading && <Skeleton />}
            </article>
            <article
              className={"summary-card" + (loading ? " is-loading" : "")}
              {...bindings[".summary-card"]}
              inert={loading}
            >
              <div className={"summary-label"} {...bindings[".summary-label"]}>
                <svg>
                  <use href={"#trend"} />
                </svg>
                {"قيد التنفيذ"}
              </div>
              <div
                className={"summary-number"}
                {...bindings[".summary-number"]}
              >
                <strong
                  id={"active-count"}
                  {...bindings["active-count"]}
                  ref={refs["active-count"]}
                >
                  {Object.hasOwn(slots, "active-count") ? (
                    slots["active-count"]
                  ) : (
                    <>{"٠"}</>
                  )}
                </strong>
                <span>{"فرص"}</span>
              </div>
              <p
                id={"pending-label"}
                {...bindings["pending-label"]}
                ref={refs["pending-label"]}
              >
                {Object.hasOwn(slots, "pending-label") ? (
                  slots["pending-label"]
                ) : (
                  <>{"لا توجد فرص بانتظار قياس الأثر"}</>
                )}
              </p>
              {loading && <Skeleton />}
            </article>
          </section>
          <section
            className={"opportunity-workspace"}
            aria-labelledby={"list-title"}
            {...bindings[".opportunity-workspace"]}
          >
            <div className={"list-intro"} {...bindings[".list-intro"]}>
              <div>
                <h2
                  id={"list-title"}
                  {...bindings["list-title"]}
                  ref={refs["list-title"]}
                >
                  {Object.hasOwn(slots, "list-title") ? (
                    slots["list-title"]
                  ) : (
                    <>
                      {"فرصك لهذا الشهر "}
                      <span
                        id={"result-count"}
                        className={"section-count"}
                        {...bindings[".section-count"]}
                        {...bindings["result-count"]}
                        ref={refs["result-count"]}
                      >
                        {Object.hasOwn(slots, "result-count") ? (
                          slots["result-count"]
                        ) : (
                          <>{"٣ فرص"}</>
                        )}
                      </span>
                    </>
                  )}
                </h2>
                <p>{"راجعي الأدلة، ثم اختاري الإجراء المناسب لمنشأتك."}</p>
              </div>
              <span className={"subtle-info"} {...bindings[".subtle-info"]}>
                <svg>
                  <use href={"#info"} />
                </svg>
                {"تنفيذ الإجراء لا يعني تحقق الوفر"}
              </span>
            </div>
            <div
              className={"opportunity-toolbar"}
              {...bindings[".opportunity-toolbar"]}
            >
              <div
                className={"category-filters"}
                role={"group"}
                aria-label={"تصفية حسب التصنيف"}
                {...bindings[".category-filters"]}
              >
                <button
                  className={"filter-pill selected"}
                  data-filter={"all"}
                  aria-pressed={"true"}
                  {...bindings[".selected"]}
                  {...bindings[".filter-pill"]}
                  {...bindings["data-filter:all"]}
                >
                  {"الكل"}
                </button>
                <button
                  className={"filter-pill"}
                  data-filter={"0"}
                  aria-pressed={"false"}
                  {...bindings[".filter-pill"]}
                  {...bindings["data-filter:0"]}
                >
                  {"المخزون والهدر"}
                </button>
                <button
                  className={"filter-pill"}
                  data-filter={"1"}
                  aria-pressed={"false"}
                  {...bindings[".filter-pill"]}
                  {...bindings["data-filter:1"]}
                >
                  {"تكلفة المنتجات"}
                </button>
                <button
                  className={"filter-pill"}
                  data-filter={"2"}
                  aria-pressed={"false"}
                  {...bindings[".filter-pill"]}
                  {...bindings["data-filter:2"]}
                >
                  {"المصروفات"}
                </button>
              </div>
              <label
                className={"sort-control"}
                htmlFor={"sort"}
                {...bindings[".sort-control"]}
              >
                {"الترتيب"}
                <Select id={"sort"} {...bindings["sort"]} ref={refs["sort"]}>
                  {Object.hasOwn(slots, "sort") ? (
                    slots["sort"]
                  ) : (
                    <>
                      <option value={"highest"}>{"الأعلى وفرًا"}</option>
                      <option value={"lowest"}>{"الأقل وفرًا"}</option>
                      <option value={"status"}>{"حسب الحالة"}</option>
                    </>
                  )}
                </Select>
              </label>
            </div>
            <div
              id={"opportunity-list"}
              aria-label={"قائمة فرص التحسين"}
              {...bindings["opportunity-list"]}
              ref={refs["opportunity-list"]}
            >
              {Object.hasOwn(slots, "opportunity-list") ? (
                slots["opportunity-list"]
              ) : (
                <></>
              )}
            </div>
            <div className={"list-footnote"} {...bindings[".list-footnote"]}>
              <svg>
                <use href={"#info"} />
              </svg>
              <p>
                {
                  "التقديرات تعتمد على افتراضات موضحة داخل كل فرصة. راجعيها قبل اعتماد الإجراء."
                }
              </p>
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
            <span
              id={"period-footer"}
              {...bindings["period-footer"]}
              ref={refs["period-footer"]}
            >
              {Object.hasOwn(slots, "period-footer") ? (
                slots["period-footer"]
              ) : (
                <>{"نسخة تجريبية · سبتمبر ٢٠٢٦"}</>
              )}
            </span>
          </footer>
        </div>
      </main>
      <button
        className={"advisor-button"}
        id={"advisor-button"}
        {...bindings[".advisor-button"]}
        {...bindings["advisor-button"]}
        ref={refs["advisor-button"]}
      >
        {Object.hasOwn(slots, "advisor-button") ? (
          slots["advisor-button"]
        ) : (
          <>
            <svg>
              <use href={"#spark"} />
            </svg>
            {"اسأل جدوى"}
          </>
        )}
      </button>
      <Dialog
        id={"opportunity-dialog"}
        className={"opportunity-sheet"}
        aria-labelledby={"sheet-title"}
        {...bindings[".opportunity-sheet"]}
        {...bindings["opportunity-dialog"]}
        ref={refs["opportunity-dialog"]}
      >
        {Object.hasOwn(slots, "opportunity-dialog") ? (
          slots["opportunity-dialog"]
        ) : (
          <>
            <div className={"sheet-header"} {...bindings[".sheet-header"]}>
              <span>{"مراجعة الفرصة"}</span>
              <button
                className={"icon-button"}
                id={"close-sheet"}
                aria-label={"إغلاق تفاصيل الفرصة"}
                {...bindings[".icon-button"]}
                {...bindings["close-sheet"]}
                ref={refs["close-sheet"]}
              >
                {Object.hasOwn(slots, "close-sheet") ? (
                  slots["close-sheet"]
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
              id={"sheet-content"}
              {...bindings["sheet-content"]}
              ref={refs["sheet-content"]}
            >
              {Object.hasOwn(slots, "sheet-content") ? (
                slots["sheet-content"]
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </Dialog>
      <Dialog
        id={"detail-dialog"}
        aria-labelledby={"dialog-title"}
        {...bindings["detail-dialog"]}
        ref={refs["detail-dialog"]}
      >
        {Object.hasOwn(slots, "detail-dialog") ? (
          slots["detail-dialog"]
        ) : (
          <>
            <div className={"dialog-header"} {...bindings[".dialog-header"]}>
              <span
                className={"dialog-eyebrow"}
                id={"dialog-eyebrow"}
                {...bindings[".dialog-eyebrow"]}
                {...bindings["dialog-eyebrow"]}
                ref={refs["dialog-eyebrow"]}
              >
                {Object.hasOwn(slots, "dialog-eyebrow") ? (
                  slots["dialog-eyebrow"]
                ) : (
                  <></>
                )}
              </span>
              <button
                className={"icon-button"}
                id={"close-dialog"}
                aria-label={"إغلاق"}
                {...bindings[".icon-button"]}
                {...bindings["close-dialog"]}
                ref={refs["close-dialog"]}
              >
                {Object.hasOwn(slots, "close-dialog") ? (
                  slots["close-dialog"]
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
              id={"dialog-content"}
              {...bindings["dialog-content"]}
              ref={refs["dialog-content"]}
            >
              {Object.hasOwn(slots, "dialog-content") ? (
                slots["dialog-content"]
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </Dialog>
      <p
        id={"loading-status"}
        className={"sr-only"}
        role={"status"}
        aria-live={"polite"}
        {...bindings[".sr-only"]}
        {...bindings["loading-status"]}
        ref={refs["loading-status"]}
      >
        {Object.hasOwn(slots, "loading-status") ? (
          slots["loading-status"]
        ) : (
          <></>
        )}
      </p>
      <div
        id={"toast"}
        role={"status"}
        {...bindings["toast"]}
        ref={refs["toast"]}
      >
        {Object.hasOwn(slots, "toast") ? slots["toast"] : <></>}
      </div>
    </>
  );
}
