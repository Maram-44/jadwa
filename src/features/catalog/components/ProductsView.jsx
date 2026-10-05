import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function ProductsView({
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
            <b>{"المنتجات والمخزون"}</b>
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
          className={"page-content catalog-page"}
          {...bindings[".catalog-page"]}
          {...bindings[".page-content"]}
        >
          <section className={"page-heading"} {...bindings[".page-heading"]}>
            <div>
              <div className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"كل صنف، جزء من الصورة"}
              </div>
              <h1>{"المنتجات والمخزون"}</h1>
              <p>{"افهم أداء أصنافك، وتابع حركة مخزونك."}</p>
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
          <div
            className={"catalog-tabs"}
            role={"tablist"}
            aria-label={"المنتجات أو المخزون"}
            {...bindings[".catalog-tabs"]}
          >
            <button
              role={"tab"}
              id={"products-tab"}
              aria-controls={"catalog-panel"}
              aria-selected={"true"}
              data-tab={"products"}
              {...bindings["data-tab:products"]}
              {...bindings["products-tab"]}
              ref={refs["products-tab"]}
            >
              {Object.hasOwn(slots, "products-tab") ? (
                slots["products-tab"]
              ) : (
                <>{"المنتجات"}</>
              )}
            </button>
            <button
              role={"tab"}
              id={"inventory-tab"}
              aria-controls={"catalog-panel"}
              aria-selected={"false"}
              tabIndex={"-1"}
              data-tab={"inventory"}
              {...bindings["data-tab:inventory"]}
              {...bindings["inventory-tab"]}
              ref={refs["inventory-tab"]}
            >
              {Object.hasOwn(slots, "inventory-tab") ? (
                slots["inventory-tab"]
              ) : (
                <>{"المخزون"}</>
              )}
            </button>
          </div>
          <section
            id={"catalog-panel"}
            role={"tabpanel"}
            aria-labelledby={"products-tab"}
            {...bindings["catalog-panel"]}
            ref={refs["catalog-panel"]}
          >
            {Object.hasOwn(slots, "catalog-panel") ? (
              slots["catalog-panel"]
            ) : (
              <>
                <div
                  id={"catalog-summary"}
                  className={"opportunity-summary"}
                  {...bindings[".opportunity-summary"]}
                  {...bindings["catalog-summary"]}
                  ref={refs["catalog-summary"]}
                >
                  {Object.hasOwn(slots, "catalog-summary") ? (
                    slots["catalog-summary"]
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className={"catalog-scope"}
                  id={"catalog-scope"}
                  {...bindings[".catalog-scope"]}
                  {...bindings["catalog-scope"]}
                  ref={refs["catalog-scope"]}
                >
                  {Object.hasOwn(slots, "catalog-scope") ? (
                    slots["catalog-scope"]
                  ) : (
                    <></>
                  )}
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
                  aria-label={"الأصناف"}
                  {...bindings[".catalog-surface"]}
                >
                  <div
                    className={"catalog-toolbar"}
                    {...bindings[".catalog-toolbar"]}
                  >
                    <div
                      className={"search-field"}
                      {...bindings[".search-field"]}
                    >
                      <svg>
                        <use href={"#tag"} />
                      </svg>
                      <label
                        className={"sr-only"}
                        htmlFor={"catalog-search"}
                        {...bindings[".sr-only"]}
                      >
                        {"بحث باسم الصنف أو رمزه"}
                      </label>
                      <input
                        type={"search"}
                        id={"catalog-search"}
                        placeholder={"ابحث باسم المنتج أو رمزه…"}
                        autoComplete={"off"}
                        {...bindings["catalog-search"]}
                        ref={refs["catalog-search"]}
                      />
                    </div>
                    <div
                      className={"catalog-filter"}
                      {...bindings[".catalog-filter"]}
                    >
                      <label htmlFor={"status-filter"}>{"الحالة"}</label>
                      <Select
                        id={"status-filter"}
                        {...bindings["status-filter"]}
                        ref={refs["status-filter"]}
                      >
                        {Object.hasOwn(slots, "status-filter") ? (
                          slots["status-filter"]
                        ) : (
                          <></>
                        )}
                      </Select>
                    </div>
                    <div
                      className={"catalog-filter"}
                      {...bindings[".catalog-filter"]}
                    >
                      <label htmlFor={"catalog-sort"}>{"الترتيب"}</label>
                      <Select
                        id={"catalog-sort"}
                        {...bindings["catalog-sort"]}
                        ref={refs["catalog-sort"]}
                      >
                        {Object.hasOwn(slots, "catalog-sort") ? (
                          slots["catalog-sort"]
                        ) : (
                          <></>
                        )}
                      </Select>
                    </div>
                    <button
                      id={"clear-filters"}
                      className={"text-button"}
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
                      id={"catalog-count"}
                      {...bindings["catalog-count"]}
                      ref={refs["catalog-count"]}
                    >
                      {Object.hasOwn(slots, "catalog-count") ? (
                        slots["catalog-count"]
                      ) : (
                        <></>
                      )}
                    </span>
                    <span
                      id={"catalog-basis"}
                      {...bindings["catalog-basis"]}
                      ref={refs["catalog-basis"]}
                    >
                      {Object.hasOwn(slots, "catalog-basis") ? (
                        slots["catalog-basis"]
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                  <div
                    id={"catalog-table"}
                    {...bindings["catalog-table"]}
                    ref={refs["catalog-table"]}
                  >
                    {Object.hasOwn(slots, "catalog-table") ? (
                      slots["catalog-table"]
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
                  id={"catalog-footnote"}
                  className={"catalog-footnote"}
                  {...bindings[".catalog-footnote"]}
                  {...bindings["catalog-footnote"]}
                  ref={refs["catalog-footnote"]}
                >
                  {Object.hasOwn(slots, "catalog-footnote") ? (
                    slots["catalog-footnote"]
                  ) : (
                    <></>
                  )}
                </p>
              </>
            )}
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
        id={"catalog-dialog"}
        className={"opportunity-sheet"}
        aria-labelledby={"sheet-title"}
        {...bindings[".opportunity-sheet"]}
        {...bindings["catalog-dialog"]}
        ref={refs["catalog-dialog"]}
      >
        {Object.hasOwn(slots, "catalog-dialog") ? (
          slots["catalog-dialog"]
        ) : (
          <>
            <div className={"sheet-header"} {...bindings[".sheet-header"]}>
              <span
                id={"sheet-caption"}
                {...bindings["sheet-caption"]}
                ref={refs["sheet-caption"]}
              >
                {Object.hasOwn(slots, "sheet-caption") ? (
                  slots["sheet-caption"]
                ) : (
                  <>{"تفاصيل الصنف"}</>
                )}
              </span>
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
