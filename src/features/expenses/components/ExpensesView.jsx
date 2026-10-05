import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function ExpensesView({
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
            <b>{"المصروفات"}</b>
          </div>
          <div className={"topbar-left"} {...bindings[".topbar-left"]}>
            <span className={"demo-label"} {...bindings[".demo-label"]}>
              {Object.hasOwn(slots, "demo-label") ? slots["demo-label"] : "بيانات توضيحية"}
            </span>
            <span className={"mini-avatar"} {...bindings[".mini-avatar"]}>
              {Object.hasOwn(slots, "mini-avatar") ? slots["mini-avatar"] : "ش"}
            </span>
            {Object.hasOwn(slots, "topbar-actions") ? slots["topbar-actions"] : null}
          </div>
        </header>
        <div
          className={"page-content expenses-page"}
          {...bindings[".expenses-page"]}
          {...bindings[".page-content"]}
        >
          <section className={"page-heading"} {...bindings[".page-heading"]}>
            <div>
              <div className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"وضوح أكبر لكل مبلغ"}
              </div>
              <h1>{"المصروفات"}</h1>
              <p>{"تابع مصروفات التشغيل، وافهم ما تغيّر."}</p>
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
          <section
            id={"expense-summary"}
            className={"opportunity-summary expense-summary"}
            aria-label={"ملخص المصروفات"}
            {...bindings[".expense-summary"]}
            {...bindings[".opportunity-summary"]}
            {...bindings["expense-summary"]}
            ref={refs["expense-summary"]}
          >
            {Object.hasOwn(slots, "expense-summary") ? (
              slots["expense-summary"]
            ) : (
              <></>
            )}
          </section>
          <div className={"expense-scope"} {...bindings[".expense-scope"]}>
            <span>
              <svg>
                <use href={"#info"} />
              </svg>
              {
                "تشمل مصروفات التشغيل فقط؛ تكلفة المبيعات والهدر محسوبان منفصلًا."
              }
            </span>
            <button
              id={"cost-breakdown"}
              className={"text-button"}
              {...bindings[".text-button"]}
              {...bindings["cost-breakdown"]}
              ref={refs["cost-breakdown"]}
            >
              {Object.hasOwn(slots, "cost-breakdown") ? (
                slots["cost-breakdown"]
              ) : (
                <>{"كيف ترتبط بإجمالي التكاليف؟"}</>
              )}
            </button>
          </div>
          <section
            className={"expense-distribution panel"}
            aria-labelledby={"distribution-title"}
            {...bindings[".panel"]}
            {...bindings[".expense-distribution"]}
          >
            <div className={"panel-heading"} {...bindings[".panel-heading"]}>
              <div>
                <h2
                  id={"distribution-title"}
                  {...bindings["distribution-title"]}
                  ref={refs["distribution-title"]}
                >
                  {Object.hasOwn(slots, "distribution-title") ? (
                    slots["distribution-title"]
                  ) : (
                    <>{"أين تتركّز المصروفات؟"}</>
                  )}
                </h2>
                <p>{"اضغطي على التصنيف لاستعراض بنوده"}</p>
              </div>
              <span
                className={"distribution-period"}
                id={"distribution-period"}
                {...bindings[".distribution-period"]}
                {...bindings["distribution-period"]}
                ref={refs["distribution-period"]}
              >
                {Object.hasOwn(slots, "distribution-period") ? (
                  slots["distribution-period"]
                ) : (
                  <></>
                )}
              </span>
            </div>
            <div
              id={"expense-bars"}
              {...bindings["expense-bars"]}
              ref={refs["expense-bars"]}
            >
              {Object.hasOwn(slots, "expense-bars") ? (
                slots["expense-bars"]
              ) : (
                <></>
              )}
            </div>
            <div
              className={"distribution-note"}
              {...bindings[".distribution-note"]}
            >
              {
                "التوزيع والملخص لجميع مصروفات الفترة، ولا يتغيران عند تصفية القائمة."
              }
            </div>
          </section>
          <section
            className={"expense-list-section"}
            aria-labelledby={"expenses-title"}
            {...bindings[".expense-list-section"]}
          >
            <div className={"list-intro"} {...bindings[".list-intro"]}>
              <div>
                <h2
                  id={"expenses-title"}
                  {...bindings["expenses-title"]}
                  ref={refs["expenses-title"]}
                >
                  {Object.hasOwn(slots, "expenses-title") ? (
                    slots["expenses-title"]
                  ) : (
                    <>{"قائمة المصروفات"}</>
                  )}
                </h2>
                <p>{"راجعي البنود ومصدرها قبل اتخاذ القرار."}</p>
              </div>
              <span className={"subtle-info"} {...bindings[".subtle-info"]}>
                {"المبالغ غير شاملة الضريبة · مثال توضيحي"}
              </span>
            </div>
            <div
              id={"related-banner"}
              hidden={true}
              {...bindings["related-banner"]}
              ref={refs["related-banner"]}
            >
              {Object.hasOwn(slots, "related-banner") ? (
                slots["related-banner"]
              ) : (
                <></>
              )}
            </div>
            <section
              className={"catalog-surface"}
              {...bindings[".catalog-surface"]}
            >
              <div
                className={"catalog-toolbar"}
                {...bindings[".catalog-toolbar"]}
              >
                <div className={"search-field"} {...bindings[".search-field"]}>
                  <svg>
                    <use href={"#file"} />
                  </svg>
                  <label
                    htmlFor={"expense-search"}
                    className={"sr-only"}
                    {...bindings[".sr-only"]}
                  >
                    {"بحث باسم البند أو الجهة"}
                  </label>
                  <input
                    type={"search"}
                    id={"expense-search"}
                    placeholder={"ابحث باسم البند أو الجهة…"}
                    autoComplete={"off"}
                    {...bindings["expense-search"]}
                    ref={refs["expense-search"]}
                  />
                </div>
                <div
                  className={"catalog-filter"}
                  {...bindings[".catalog-filter"]}
                >
                  <label htmlFor={"expense-category"}>{"التصنيف"}</label>
                  <Select
                    id={"expense-category"}
                    {...bindings["expense-category"]}
                    ref={refs["expense-category"]}
                  >
                    {Object.hasOwn(slots, "expense-category") ? (
                      slots["expense-category"]
                    ) : (
                      <></>
                    )}
                  </Select>
                </div>
                <div
                  className={"catalog-filter"}
                  {...bindings[".catalog-filter"]}
                >
                  <label htmlFor={"expense-recurrence"}>{"التكرار"}</label>
                  <Select
                    id={"expense-recurrence"}
                    {...bindings["expense-recurrence"]}
                    ref={refs["expense-recurrence"]}
                  >
                    {Object.hasOwn(slots, "expense-recurrence") ? (
                      slots["expense-recurrence"]
                    ) : (
                      <>
                        <option value={"all"}>{"الكل"}</option>
                        <option value={"recurring"}>{"متكرر"}</option>
                        <option value={"one-off"}>{"غير متكرر"}</option>
                      </>
                    )}
                  </Select>
                </div>
                <div
                  className={"catalog-filter"}
                  {...bindings[".catalog-filter"]}
                >
                  <label htmlFor={"expense-sort"}>{"الترتيب"}</label>
                  <Select
                    id={"expense-sort"}
                    {...bindings["expense-sort"]}
                    ref={refs["expense-sort"]}
                  >
                    {Object.hasOwn(slots, "expense-sort") ? (
                      slots["expense-sort"]
                    ) : (
                      <>
                        <option value={"date-desc"}>{"الأحدث تاريخًا"}</option>
                        <option value={"date-asc"}>{"الأقدم تاريخًا"}</option>
                        <option value={"amount-desc"}>{"الأعلى مبلغًا"}</option>
                        <option value={"amount-asc"}>{"الأقل مبلغًا"}</option>
                      </>
                    )}
                  </Select>
                </div>
                <button
                  className={"text-button"}
                  id={"clear-filters"}
                  {...bindings[".text-button"]}
                  {...bindings["clear-filters"]}
                  ref={refs["clear-filters"]}
                >
                  {Object.hasOwn(slots, "clear-filters") ? (
                    slots["clear-filters"]
                  ) : (
                    <>{"مسح الفلاتر"}</>
                  )}
                </button>
              </div>
              <div
                className={"catalog-list-meta"}
                {...bindings[".catalog-list-meta"]}
              >
                <span
                  id={"expense-count"}
                  {...bindings["expense-count"]}
                  ref={refs["expense-count"]}
                >
                  {Object.hasOwn(slots, "expense-count") ? (
                    slots["expense-count"]
                  ) : (
                    <></>
                  )}
                </span>
                <span
                  id={"filtered-total"}
                  {...bindings["filtered-total"]}
                  ref={refs["filtered-total"]}
                >
                  {Object.hasOwn(slots, "filtered-total") ? (
                    slots["filtered-total"]
                  ) : (
                    <></>
                  )}
                </span>
              </div>
              <div
                id={"expense-table"}
                {...bindings["expense-table"]}
                ref={refs["expense-table"]}
              >
                {Object.hasOwn(slots, "expense-table") ? (
                  slots["expense-table"]
                ) : (
                  <></>
                )}
              </div>
              <div
                id={"catalog-message"}
                hidden={true}
                {...bindings["catalog-message"]}
                ref={refs["catalog-message"]}
              >
                {Object.hasOwn(slots, "catalog-message") ? (
                  slots["catalog-message"]
                ) : (
                  <></>
                )}
              </div>
            </section>
            <p
              className={"catalog-footnote"}
              {...bindings[".catalog-footnote"]}
            >
              {
                "زيادة المصروف تحتاج تفسيرًا؛ قد تعكس تغيّر حجم النشاط. تشابه الاشتراكات لا يثبت أنها غير ضرورية."
              }
            </p>
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
                <></>
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
        id={"expense-dialog"}
        className={"opportunity-sheet"}
        aria-labelledby={"sheet-title"}
        {...bindings[".opportunity-sheet"]}
        {...bindings["expense-dialog"]}
        ref={refs["expense-dialog"]}
      >
        {Object.hasOwn(slots, "expense-dialog") ? (
          slots["expense-dialog"]
        ) : (
          <>
            <div className={"sheet-header"} {...bindings[".sheet-header"]}>
              <span>{"تفاصيل المصروف"}</span>
              <button
                className={"icon-button"}
                id={"close-sheet"}
                aria-label={"إغلاق التفاصيل"}
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
                {...bindings[".dialog-eyebrow"]}
              >
                {"جدوى · نسخة تجريبية"}
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
    </>
  );
}
