import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function DashboardView({
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
            <span>{"مساحة العمل"}</span>
            <span className={"slash"} {...bindings[".slash"]}>
              {"/"}
            </span>
            <b>{"نظرة عامة"}</b>
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
        <div className={"page-content"} {...bindings[".page-content"]}>
          <section className={"page-heading"} {...bindings[".page-heading"]}>
            <div>
              <div className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"من البيانات إلى القرار"}
              </div>
              <h1>
                {"صباح الخير، الشيماء "}
                <span
                  className={"greeting-dot"}
                  {...bindings[".greeting-dot"]}
                ></span>
              </h1>
              <p>{"نظرة على أداء منشأتك، وفرص تستحق انتباهك."}</p>
            </div>
            <button
              className={"meeting-button"}
              id={"meeting-button"}
              {...bindings[".meeting-button"]}
              {...bindings["meeting-button"]}
              ref={refs["meeting-button"]}
            >
              {Object.hasOwn(slots, "meeting-button") ? (
                slots["meeting-button"]
              ) : (
                <>
                  <svg>
                    <use href={"#video"} />
                  </svg>
                  {"دخول اجتماع مع جدوى"}
                </>
              )}
            </button>
          </section>
          <div className={"period-row"} {...bindings[".period-row"]}>
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
            <span className={"last-update"} {...bindings[".last-update"]}>
              <span></span>
              {"بيانات مكتملة للفترة المحددة"}
            </span>
          </div>
          <section
            className={"metrics"}
            aria-label={"ملخص الأداء"}
            {...bindings[".metrics"]}
          >
            <article
              className={"saving-card"}
              {...bindings[".saving-card"]}
              inert={loading}
              className={"saving-card" + (loading ? " is-loading" : "")}
            >
              <div className={"saving-top"} {...bindings[".saving-top"]}>
                <span>
                  <svg>
                    <use href={"#spark"} />
                  </svg>
                  {"وفر محتمل هذا الشهر"}
                </span>
                <span className={"estimate"} {...bindings[".estimate"]}>
                  {"تقديري"}
                </span>
              </div>
              <div className={"saving-value"} {...bindings[".saving-value"]}>
                <strong
                  id={"saving"}
                  {...bindings["saving"]}
                  ref={refs["saving"]}
                >
                  {Object.hasOwn(slots, "saving") ? (
                    slots["saving"]
                  ) : (
                    <>{"٢٬٥٠٠"}</>
                  )}
                </strong>
                <span>
                  <span
                    className={"riyal-symbol"}
                    role={"img"}
                    aria-label={"ريال سعودي"}
                    {...bindings[".riyal-symbol"]}
                  ></span>
                </span>
              </div>
              <p
                id={"saving-caption"}
                {...bindings["saving-caption"]}
                ref={refs["saving-caption"]}
              >
                {Object.hasOwn(slots, "saving-caption") ? (
                  slots["saving-caption"]
                ) : (
                  <>{"٣ فرص تساعدك على تقليل التكاليف"}</>
                )}
              </p>
              <button
                data-action={"opportunities"}
                {...bindings["data-action:opportunities"]}
              >
                {"استعرض فرص التحسين"}
              </button>
              <span
                className={"saving-decoration"}
                aria-hidden={"true"}
                {...bindings[".saving-decoration"]}
              ></span>
              {loading && <Skeleton chart={false} />}
            </article>
            <article
              className={"metric-card"}
              {...bindings[".metric-card"]}
              inert={loading}
              className={"metric-card" + (loading ? " is-loading" : "")}
            >
              <div
                className={"metric-heading"}
                {...bindings[".metric-heading"]}
              >
                <span
                  className={"tile blue"}
                  {...bindings[".blue"]}
                  {...bindings[".tile"]}
                >
                  <svg>
                    <use href={"#chart"} />
                  </svg>
                </span>
                <span>{"إجمالي المبيعات"}</span>
              </div>
              <div className={"metric-value"} {...bindings[".metric-value"]}>
                <strong
                  id={"revenue"}
                  {...bindings["revenue"]}
                  ref={refs["revenue"]}
                >
                  {Object.hasOwn(slots, "revenue") ? (
                    slots["revenue"]
                  ) : (
                    <>{"٤٨٬٠٠٠"}</>
                  )}
                </strong>
                <span>
                  <span
                    className={"riyal-symbol"}
                    role={"img"}
                    aria-label={"ريال سعودي"}
                    {...bindings[".riyal-symbol"]}
                  ></span>
                </span>
              </div>
              <div className={"metric-footer"} {...bindings[".metric-footer"]}>
                <span
                  className={"change good"}
                  id={"revenue-change"}
                  {...bindings[".good"]}
                  {...bindings[".change"]}
                  {...bindings["revenue-change"]}
                  ref={refs["revenue-change"]}
                >
                  {Object.hasOwn(slots, "revenue-change") ? (
                    slots["revenue-change"]
                  ) : (
                    <>{"+١٥٪"}</>
                  )}
                </span>
                <span>{"عن الشهر السابق"}</span>
              </div>
              <svg
                className={"sparkline blue-line"}
                viewBox={"0 0 180 30"}
                aria-hidden={"true"}
                {...bindings[".blue-line"]}
                {...bindings[".sparkline"]}
              >
                <path
                  d={
                    "M0 26 20 22 40 24 60 14 80 17 100 10 120 15 140 7 160 11 180 2"
                  }
                />
              </svg>
              {loading && <Skeleton chart={false} />}
            </article>
            <article
              className={"metric-card"}
              {...bindings[".metric-card"]}
              inert={loading}
              className={"metric-card" + (loading ? " is-loading" : "")}
            >
              <div
                className={"metric-heading"}
                {...bindings[".metric-heading"]}
              >
                <span
                  className={"tile coral"}
                  {...bindings[".coral"]}
                  {...bindings[".tile"]}
                >
                  <svg>
                    <use href={"#wallet"} />
                  </svg>
                </span>
                <span>{"إجمالي التكاليف"}</span>
              </div>
              <div className={"metric-value"} {...bindings[".metric-value"]}>
                <strong id={"cost"} {...bindings["cost"]} ref={refs["cost"]}>
                  {Object.hasOwn(slots, "cost") ? (
                    slots["cost"]
                  ) : (
                    <>{"٣٦٬٠٠٠"}</>
                  )}
                </strong>
                <span>
                  <span
                    className={"riyal-symbol"}
                    role={"img"}
                    aria-label={"ريال سعودي"}
                    {...bindings[".riyal-symbol"]}
                  ></span>
                </span>
              </div>
              <div className={"metric-footer"} {...bindings[".metric-footer"]}>
                <span
                  className={"change caution"}
                  id={"cost-change"}
                  {...bindings[".caution"]}
                  {...bindings[".change"]}
                  {...bindings["cost-change"]}
                  ref={refs["cost-change"]}
                >
                  {Object.hasOwn(slots, "cost-change") ? (
                    slots["cost-change"]
                  ) : (
                    <>{"+٨٪"}</>
                  )}
                </span>
                <span>{"عن الشهر السابق"}</span>
              </div>
              <svg
                className={"sparkline coral-line"}
                viewBox={"0 0 180 30"}
                aria-hidden={"true"}
                {...bindings[".coral-line"]}
                {...bindings[".sparkline"]}
              >
                <path
                  d={
                    "M0 26 20 23 40 25 60 20 80 22 100 15 120 16 140 9 160 12 180 6"
                  }
                />
              </svg>
              {loading && <Skeleton chart={false} />}
            </article>
            <article
              className={"metric-card"}
              {...bindings[".metric-card"]}
              inert={loading}
              className={"metric-card" + (loading ? " is-loading" : "")}
            >
              <div
                className={"metric-heading"}
                {...bindings[".metric-heading"]}
              >
                <span
                  className={"tile mint"}
                  {...bindings[".mint"]}
                  {...bindings[".tile"]}
                >
                  <svg>
                    <use href={"#trend"} />
                  </svg>
                </span>
                <span>{"صافي الربح"}</span>
              </div>
              <div className={"metric-value"} {...bindings[".metric-value"]}>
                <strong
                  id={"profit"}
                  {...bindings["profit"]}
                  ref={refs["profit"]}
                >
                  {Object.hasOwn(slots, "profit") ? (
                    slots["profit"]
                  ) : (
                    <>{"١٢٬٠٠٠"}</>
                  )}
                </strong>
                <span>
                  <span
                    className={"riyal-symbol"}
                    role={"img"}
                    aria-label={"ريال سعودي"}
                    {...bindings[".riyal-symbol"]}
                  ></span>
                </span>
              </div>
              <div className={"metric-footer"} {...bindings[".metric-footer"]}>
                <span
                  className={"change good"}
                  id={"profit-change"}
                  {...bindings[".good"]}
                  {...bindings[".change"]}
                  {...bindings["profit-change"]}
                  ref={refs["profit-change"]}
                >
                  {Object.hasOwn(slots, "profit-change") ? (
                    slots["profit-change"]
                  ) : (
                    <>{"+٤٢٪"}</>
                  )}
                </span>
                <span>{"عن الشهر السابق"}</span>
              </div>
              <svg
                className={"sparkline mint-line"}
                viewBox={"0 0 180 30"}
                aria-hidden={"true"}
                {...bindings[".mint-line"]}
                {...bindings[".sparkline"]}
              >
                <path
                  d={
                    "M0 29 20 26 40 28 60 21 80 23 100 14 120 18 140 8 160 12 180 2"
                  }
                />
              </svg>
              {loading && <Skeleton chart={false} />}
            </article>
          </section>
          <section
            className={"opportunities-section"}
            id={"opportunities"}
            {...bindings[".opportunities-section"]}
            {...bindings["opportunities"]}
            ref={refs["opportunities"]}
          >
            {Object.hasOwn(slots, "opportunities") ? (
              slots["opportunities"]
            ) : (
              <>
                <div
                  className={"section-heading"}
                  {...bindings[".section-heading"]}
                >
                  <div>
                    <h2>
                      {"من أين نبدأ؟ "}
                      <span
                        className={"section-count"}
                        {...bindings[".section-count"]}
                      >
                        {"٣ فرص"}
                      </span>
                    </h2>
                    <p>{"أهم الإجراءات المقترحة، مرتبة حسب أثرها المتوقع."}</p>
                  </div>
                  <span className={"subtle-info"} {...bindings[".subtle-info"]}>
                    <svg>
                      <use href={"#info"} />
                    </svg>
                    {"تقديرات وليست وفرًا محققًا"}
                  </span>
                </div>
                <div
                  className={"opportunity-grid"}
                  id={"opportunity-grid"}
                  {...bindings[".opportunity-grid"]}
                  {...bindings["opportunity-grid"]}
                  ref={refs["opportunity-grid"]}
                >
                  {Object.hasOwn(slots, "opportunity-grid") ? (
                    slots["opportunity-grid"]
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
          </section>
          <section className={"bottom-grid"} {...bindings[".bottom-grid"]}>
            <article
              className={"panel performance"}
              {...bindings[".performance"]}
              {...bindings[".panel"]}
              inert={loading}
              className={"panel performance" + (loading ? " is-loading" : "")}
            >
              <div className={"panel-heading"} {...bindings[".panel-heading"]}>
                <div>
                  <h2>{"أداء المنشأة"}</h2>
                  <p>{"المبيعات والتكاليف خلال الشهر"}</p>
                </div>
                <div className={"legend"} {...bindings[".legend"]}>
                  <span>
                    <i className={"blue-dot"} {...bindings[".blue-dot"]}></i>
                    {"المبيعات"}
                  </span>
                  <span>
                    <i className={"mint-dot"} {...bindings[".mint-dot"]}></i>
                    {"التكاليف"}
                  </span>
                </div>
              </div>
              <div
                className={"chart-wrap"}
                id={"chart-wrap"}
                {...bindings[".chart-wrap"]}
                {...bindings["chart-wrap"]}
                ref={refs["chart-wrap"]}
              >
                {Object.hasOwn(slots, "chart-wrap") ? (
                  slots["chart-wrap"]
                ) : (
                  <></>
                )}
              </div>
              <div className={"chart-foot"} {...bindings[".chart-foot"]}>
                <span>
                  <svg>
                    <use href={"#trend"} />
                  </svg>
                  <span
                    id={"chart-insight"}
                    {...bindings["chart-insight"]}
                    ref={refs["chart-insight"]}
                  >
                    {Object.hasOwn(slots, "chart-insight") ? (
                      slots["chart-insight"]
                    ) : (
                      <>{"المبيعات تغطي التكاليف في جميع أسابيع الشهر."}</>
                    )}
                  </span>
                </span>
                <button
                  className={"text-button"}
                  id={"chart-data"}
                  {...bindings[".text-button"]}
                  {...bindings["chart-data"]}
                  ref={refs["chart-data"]}
                >
                  {Object.hasOwn(slots, "chart-data") ? (
                    slots["chart-data"]
                  ) : (
                    <>{"عرض الأرقام"}</>
                  )}
                </button>
              </div>
              {loading && <Skeleton chart={true} />}
            </article>
            <article
              className={"panel data-panel"}
              {...bindings[".data-panel"]}
              {...bindings[".panel"]}
              inert={loading}
              className={"panel data-panel" + (loading ? " is-loading" : "")}
            >
              <div className={"panel-heading"} {...bindings[".panel-heading"]}>
                <div>
                  <h2>{"بياناتك متصلة بالصورة"}</h2>
                  <p>{"مصادر التحليل لهذا الشهر"}</p>
                </div>
                <span
                  className={"tile neutral"}
                  {...bindings[".neutral"]}
                  {...bindings[".tile"]}
                >
                  <svg>
                    <use href={"#database"} />
                  </svg>
                </span>
              </div>
              <div className={"source-row"} {...bindings[".source-row"]}>
                <span className={"source-icon"} {...bindings[".source-icon"]}>
                  <svg>
                    <use href={"#file"} />
                  </svg>
                </span>
                <div>
                  <b>{"المبيعات"}</b>
                  <small>{"ملف المبيعات الشهري"}</small>
                </div>
                <span className={"source-check"} {...bindings[".source-check"]}>
                  <svg>
                    <use href={"#check"} />
                  </svg>
                </span>
              </div>
              <div className={"source-row"} {...bindings[".source-row"]}>
                <span className={"source-icon"} {...bindings[".source-icon"]}>
                  <svg>
                    <use href={"#file"} />
                  </svg>
                </span>
                <div>
                  <b>{"المصروفات"}</b>
                  <small>{"التكاليف التشغيلية والمشتريات"}</small>
                </div>
                <span className={"source-check"} {...bindings[".source-check"]}>
                  <svg>
                    <use href={"#check"} />
                  </svg>
                </span>
              </div>
              <div className={"source-row"} {...bindings[".source-row"]}>
                <span className={"source-icon"} {...bindings[".source-icon"]}>
                  <svg>
                    <use href={"#file"} />
                  </svg>
                </span>
                <div>
                  <b>{"المخزون والهدر"}</b>
                  <small>{"حركة الأصناف والمواد"}</small>
                </div>
                <span className={"source-check"} {...bindings[".source-check"]}>
                  <svg>
                    <use href={"#check"} />
                  </svg>
                </span>
              </div>
              <button
                className={"data-button"}
                data-action={"data"}
                {...bindings[".data-button"]}
                {...bindings["data-action:data"]}
              >
                {"استعرض مصادر البيانات"}
              </button>
              {loading && <Skeleton chart={false} />}
            </article>
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
            <span>
              {slots["period-footer"] || "نسخة تجريبية · سبتمبر ٢٠٢٦"}
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
      <div
        id={"toast"}
        role={"status"}
        {...bindings["toast"]}
        ref={refs["toast"]}
      >
        {Object.hasOwn(slots, "toast") ? slots["toast"] : <></>}
      </div>
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
