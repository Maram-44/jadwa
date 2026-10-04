import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function IndexView({
  slots = {},
  bindings = {},
  refs = {},
  active,
  loading = false,
}) {
  return (
    <>
      <a className={"skip-link"} href={"#main"} {...bindings[".skip-link"]}>
        {"انتقل إلى المحتوى"}
      </a>
      <IconDefinitions />
      <div
        id={"brand-intro"}
        className={"brand-intro"}
        {...bindings[".brand-intro"]}
        {...bindings["brand-intro"]}
        ref={refs["brand-intro"]}
      >
        {Object.hasOwn(slots, "brand-intro") ? (
          slots["brand-intro"]
        ) : (
          <>
            <div className={"intro-veil"} {...bindings[".intro-veil"]}></div>
            <div
              id={"intro-logo"}
              className={"intro-logo"}
              {...bindings[".intro-logo"]}
              {...bindings["intro-logo"]}
              ref={refs["intro-logo"]}
            >
              {Object.hasOwn(slots, "intro-logo") ? (
                slots["intro-logo"]
              ) : (
                <>
                  <svg
                    className={"brand-art"}
                    viewBox={"230 335 995 380"}
                    aria-hidden={"true"}
                    {...bindings[".brand-art"]}
                  >
                    <defs>
                      <image
                        id={"intro-raster"}
                        href={"assets/jadwa-logo.png"}
                        width={"1448"}
                        height={"1086"}
                        {...bindings["intro-raster"]}
                        ref={refs["intro-raster"]}
                      >
                        {Object.hasOwn(slots, "intro-raster") ? (
                          slots["intro-raster"]
                        ) : (
                          <></>
                        )}
                      </image>
                      <clippath
                        id={"word-clip"}
                        {...bindings["word-clip"]}
                        ref={refs["word-clip"]}
                      >
                        {Object.hasOwn(slots, "word-clip") ? (
                          slots["word-clip"]
                        ) : (
                          <>
                            <rect
                              x={"230"}
                              y={"335"}
                              width={"790"}
                              height={"380"}
                            />
                          </>
                        )}
                      </clippath>
                      <clippath
                        id={"blue-clip"}
                        {...bindings["blue-clip"]}
                        ref={refs["blue-clip"]}
                      >
                        {Object.hasOwn(slots, "blue-clip") ? (
                          slots["blue-clip"]
                        ) : (
                          <>
                            <path
                              d={"M1020 335H1230V449H1120Q1060 444 1020 493Z"}
                            />
                          </>
                        )}
                      </clippath>
                      <clippath
                        id={"mint-clip"}
                        {...bindings["mint-clip"]}
                        ref={refs["mint-clip"]}
                      >
                        {Object.hasOwn(slots, "mint-clip") ? (
                          slots["mint-clip"]
                        ) : (
                          <>
                            <path
                              d={
                                "M1020 493Q1060 444 1120 449H1230V559H1110Q1050 554 1020 586Z"
                              }
                            />
                          </>
                        )}
                      </clippath>
                      <clippath
                        id={"gold-clip"}
                        {...bindings["gold-clip"]}
                        ref={refs["gold-clip"]}
                      >
                        {Object.hasOwn(slots, "gold-clip") ? (
                          slots["gold-clip"]
                        ) : (
                          <>
                            <path
                              d={"M1020 586Q1050 554 1110 559H1230V715H1020Z"}
                            />
                          </>
                        )}
                      </clippath>
                    </defs>
                    <g
                      className={"intro-piece piece-blue"}
                      clipPath={"url(#blue-clip)"}
                      {...bindings[".piece-blue"]}
                      {...bindings[".intro-piece"]}
                    >
                      <use href={"#intro-raster"} />
                    </g>
                    <g
                      className={"intro-piece piece-mint"}
                      clipPath={"url(#mint-clip)"}
                      {...bindings[".piece-mint"]}
                      {...bindings[".intro-piece"]}
                    >
                      <use href={"#intro-raster"} />
                    </g>
                    <g
                      className={"intro-piece piece-gold"}
                      clipPath={"url(#gold-clip)"}
                      {...bindings[".piece-gold"]}
                      {...bindings[".intro-piece"]}
                    >
                      <use href={"#intro-raster"} />
                    </g>
                    <g
                      className={"intro-word"}
                      clipPath={"url(#word-clip)"}
                      {...bindings[".intro-word"]}
                    >
                      <use href={"#intro-raster"} />
                    </g>
                  </svg>
                </>
              )}
            </div>
            <button
              id={"skip-intro"}
              className={"skip-intro"}
              type={"button"}
              {...bindings[".skip-intro"]}
              {...bindings["skip-intro"]}
              ref={refs["skip-intro"]}
            >
              {Object.hasOwn(slots, "skip-intro") ? (
                slots["skip-intro"]
              ) : (
                <>{"تخطّي المقدمة"}</>
              )}
            </button>
          </>
        )}
      </div>
      <header
        className={"site-header"}
        id={"site-header"}
        {...bindings[".site-header"]}
        {...bindings["site-header"]}
        ref={refs["site-header"]}
      >
        {Object.hasOwn(slots, "site-header") ? (
          slots["site-header"]
        ) : (
          <>
            <div
              className={"nav-wrap container"}
              {...bindings[".container"]}
              {...bindings[".nav-wrap"]}
            >
              <a
                className={"brand"}
                id={"nav-logo"}
                href={"index.html"}
                aria-label={"جدوى الرئيسية"}
                {...bindings[".brand"]}
                {...bindings["nav-logo"]}
                ref={refs["nav-logo"]}
              >
                {Object.hasOwn(slots, "nav-logo") ? (
                  slots["nav-logo"]
                ) : (
                  <>
                    <svg
                      className={"brand-art"}
                      viewBox={"230 335 995 380"}
                      role={"img"}
                      aria-label={"جدوى"}
                      {...bindings[".brand-art"]}
                    >
                      <image
                        href={"assets/jadwa-logo.png"}
                        width={"1448"}
                        height={"1086"}
                      ></image>
                    </svg>
                  </>
                )}
              </a>
              <nav
                id={"landing-nav"}
                aria-label={"التنقل الرئيسي"}
                {...bindings["landing-nav"]}
                ref={refs["landing-nav"]}
              >
                {Object.hasOwn(slots, "landing-nav") ? (
                  slots["landing-nav"]
                ) : (
                  <>
                    <a href={"#how"}>{"كيف يعمل؟"}</a>
                    <a href={"#opportunities"}>{"فرص التحسين"}</a>
                    <a href={"#advisor"}>{"مستشارك"}</a>
                  </>
                )}
              </nav>
              <div className={"nav-actions"} {...bindings[".nav-actions"]}>
                <a
                  className={"nav-login"}
                  href={"login.html"}
                  {...bindings[".nav-login"]}
                >
                  {"تسجيل الدخول"}
                </a>
                <a
                  className={"button button-small"}
                  href={"register.html"}
                  {...bindings[".button-small"]}
                  {...bindings[".button"]}
                >
                  {"ابدأ الآن"}
                </a>
                <button
                  className={"menu-toggle"}
                  id={"landing-menu"}
                  aria-label={"فتح القائمة"}
                  aria-expanded={"false"}
                  aria-controls={"landing-nav"}
                  {...bindings[".menu-toggle"]}
                  {...bindings["landing-menu"]}
                  ref={refs["landing-menu"]}
                >
                  {Object.hasOwn(slots, "landing-menu") ? (
                    slots["landing-menu"]
                  ) : (
                    <>
                      <svg aria-hidden={"true"}>
                        <use href={"#menu"} />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </header>
      <main
        ref={refs.main}
        id={"main"}
        {...bindings["main"]}
        ref={refs["main"]}
      >
        {Object.hasOwn(slots, "main") ? (
          slots["main"]
        ) : (
          <>
            <section
              className={"hero container"}
              aria-labelledby={"hero-title"}
              {...bindings[".container"]}
              {...bindings[".hero"]}
            >
              <div className={"hero-copy"} {...bindings[".hero-copy"]}>
                <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                  <span
                    className={"eyebrow-line"}
                    {...bindings[".eyebrow-line"]}
                  ></span>
                  {"صورة أوضح لمنشأتك"}
                </p>
                <h1
                  id={"hero-title"}
                  {...bindings["hero-title"]}
                  ref={refs["hero-title"]}
                >
                  {Object.hasOwn(slots, "hero-title") ? (
                    slots["hero-title"]
                  ) : (
                    <>
                      <span
                        className={"title-line"}
                        {...bindings[".title-line"]}
                      >
                        {"من أرقام مبعثرة،"}
                      </span>
                      <span
                        className={"title-line accent"}
                        {...bindings[".accent"]}
                        {...bindings[".title-line"]}
                      >
                        {"لقرارات أوضح"}
                        <span
                          className={"title-dot"}
                          {...bindings[".title-dot"]}
                        >
                          {"."}
                        </span>
                      </span>
                    </>
                  )}
                </h1>
                <p
                  className={"hero-description"}
                  {...bindings[".hero-description"]}
                >
                  {
                    "اعرف وين يروح ربحك. شوف مبيعاتك ومصاريفك ومخزونك في صورة واحدة، وحدّد الفرصة اللي تستحق تبدأ منها."
                  }
                </p>
                <div className={"hero-actions"} {...bindings[".hero-actions"]}>
                  <a
                    className={"button"}
                    href={"register.html"}
                    {...bindings[".button"]}
                  >
                    {"ابدأ مع جدوى"}
                  </a>
                  <a
                    className={"button button-quiet"}
                    href={"#how"}
                    {...bindings[".button-quiet"]}
                    {...bindings[".button"]}
                  >
                    {"اكتشف كيف يعمل"}
                  </a>
                </div>
                <p className={"hero-note"} {...bindings[".hero-note"]}>
                  <a href={"dashboard.html"}>
                    {"أو استكشف الديمو كزائر، بدون تسجيل"}
                  </a>
                </p>
              </div>
              <div
                className={"product-stage"}
                id={"product-stage"}
                {...bindings[".product-stage"]}
                {...bindings["product-stage"]}
                ref={refs["product-stage"]}
              >
                {Object.hasOwn(slots, "product-stage") ? (
                  slots["product-stage"]
                ) : (
                  <>
                    <div
                      className={"preview-label"}
                      {...bindings[".preview-label"]}
                    >
                      <span>{"نظرة على منشأتك"}</span>
                      <span>{"مثال توضيحي · سبتمبر ٢٠٢٦"}</span>
                    </div>
                    <div
                      className={"dashboard-preview"}
                      {...bindings[".dashboard-preview"]}
                    >
                      <div
                        className={"dashboard-top"}
                        {...bindings[".dashboard-top"]}
                      >
                        <div>
                          <b>{"كل التفاصيل، في صورة واحدة."}</b>
                          <span>{"مبيعاتك اليوم توجّه قرارك القادم."}</span>
                        </div>
                        <span
                          className={"preview-period"}
                          {...bindings[".preview-period"]}
                        >
                          <svg aria-hidden={"true"}>
                            <use href={"#calendar"} />
                          </svg>
                          {" سبتمبر ٢٠٢٦"}
                        </span>
                      </div>
                      <div
                        className={"dashboard-body"}
                        {...bindings[".dashboard-body"]}
                      >
                        <div
                          className={"preview-main"}
                          {...bindings[".preview-main"]}
                        >
                          <div
                            className={"preview-metrics"}
                            {...bindings[".preview-metrics"]}
                          >
                            <div>
                              <span>{"المبيعات"}</span>
                              <strong>
                                {"٤٨٬٠٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </strong>
                              <small>{"+١٥٪ عن الشهر السابق"}</small>
                            </div>
                            <div>
                              <span>{"التكاليف"}</span>
                              <strong>
                                {"٣٦٬٠٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </strong>
                              <small
                                className={"muted"}
                                {...bindings[".muted"]}
                              >
                                {"تكاليف الفترة كاملة"}
                              </small>
                            </div>
                            <div>
                              <span>{"صافي الربح"}</span>
                              <strong>
                                {"١٢٬٠٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </strong>
                              <small>{"+٤٢٪ عن الشهر السابق"}</small>
                            </div>
                          </div>
                          <div
                            className={"mini-chart"}
                            {...bindings[".mini-chart"]}
                          >
                            <div
                              className={"chart-heading"}
                              {...bindings[".chart-heading"]}
                            >
                              <b>{"أداء المنشأة"}</b>
                              <span>
                                <i
                                  className={"dot blue"}
                                  {...bindings[".blue"]}
                                  {...bindings[".dot"]}
                                ></i>
                                {" المبيعات "}
                                <i
                                  className={"dot mint"}
                                  {...bindings[".mint"]}
                                  {...bindings[".dot"]}
                                ></i>
                                {" التكاليف"}
                              </span>
                            </div>
                            <div
                              className={"chart-bars"}
                              role={"img"}
                              aria-label={
                                "مبيعات الأسابيع: ٩ آلاف، ١٢ ألفًا، ١٥ ألفًا، ١٢ ألف ريال. التكاليف: ٧٥٠٠، ٨٥٠٠، ١٠٥٠٠، ٩٥٠٠ ريال."
                              }
                              {...bindings[".chart-bars"]}
                            >
                              <div
                                className={"bar-group"}
                                {...bindings[".bar-group"]}
                              >
                                <div
                                  className={"bar-pair"}
                                  {...bindings[".bar-pair"]}
                                >
                                  <i style={{ "--bar": "60.00%" }}></i>
                                  <i style={{ "--bar": "50.00%" }}></i>
                                </div>
                                <span>{"الأسبوع ١"}</span>
                              </div>
                              <div
                                className={"bar-group"}
                                {...bindings[".bar-group"]}
                              >
                                <div
                                  className={"bar-pair"}
                                  {...bindings[".bar-pair"]}
                                >
                                  <i style={{ "--bar": "80.00%" }}></i>
                                  <i style={{ "--bar": "56.67%" }}></i>
                                </div>
                                <span>{"الأسبوع ٢"}</span>
                              </div>
                              <div
                                className={"bar-group"}
                                {...bindings[".bar-group"]}
                              >
                                <div
                                  className={"bar-pair"}
                                  {...bindings[".bar-pair"]}
                                >
                                  <i style={{ "--bar": "100.00%" }}></i>
                                  <i style={{ "--bar": "70.00%" }}></i>
                                </div>
                                <span>{"الأسبوع ٣"}</span>
                              </div>
                              <div
                                className={"bar-group"}
                                {...bindings[".bar-group"]}
                              >
                                <div
                                  className={"bar-pair"}
                                  {...bindings[".bar-pair"]}
                                >
                                  <i style={{ "--bar": "80.00%" }}></i>
                                  <i style={{ "--bar": "63.33%" }}></i>
                                </div>
                                <span>{"الأسبوع ٤"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={"preview-saving"}
                          {...bindings[".preview-saving"]}
                        >
                          <div
                            className={"saving-caption"}
                            {...bindings[".saving-caption"]}
                          >
                            <svg aria-hidden={"true"}>
                              <use href={"#spark"} />
                            </svg>
                            {" وفر محتمل هذا الشهر"}
                          </div>
                          <strong>
                            {"٢٬٥٠٠ "}
                            <span
                              className={"riyal-symbol"}
                              role={"img"}
                              aria-label={"ريال سعودي"}
                              {...bindings[".riyal-symbol"]}
                            ></span>
                          </strong>
                          <p>{"٣ فرص. وخطوة واضحة لكل فرصة."}</p>
                          <div
                            className={"saving-breakdown"}
                            {...bindings[".saving-breakdown"]}
                          >
                            <span>
                              {"هدر المخزون "}
                              <b>{"١٬٢٠٠"}</b>
                            </span>
                            <span>
                              {"تكلفة المنتجات "}
                              <b>{"٨٠٠"}</b>
                            </span>
                            <span>
                              {"المصروفات "}
                              <b>{"٥٠٠"}</b>
                            </span>
                          </div>
                          <a href={"opportunities.html?month=sep"}>
                            {"استكشف الفرص الثلاث"}
                          </a>
                          <small>{"تقديرات وليست وفرًا محققًا"}</small>
                        </div>
                      </div>
                    </div>
                    <div className={"stage-foot"} {...bindings[".stage-foot"]}>
                      <span>{"المبيعات"}</span>
                      <i></i>
                      <span>{"المخزون"}</span>
                      <i></i>
                      <span>{"المصروفات"}</span>
                      <span
                        className={"stage-result"}
                        {...bindings[".stage-result"]}
                      >
                        {"قرار تعرف سببه."}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className={"audience-line"} {...bindings[".audience-line"]}>
                <span>{"لمنشأتك، مهما كانت بدايتها."}</span>
                <span>{"الكافيهات"}</span>
                <span>{"المطاعم"}</span>
                <span>{"المتاجر الصغيرة"}</span>
              </div>
            </section>
            <section
              className={"how section container reveal"}
              id={"how"}
              aria-labelledby={"how-title"}
              {...bindings[".reveal"]}
              {...bindings[".container"]}
              {...bindings[".section"]}
              {...bindings[".how"]}
              {...bindings["how"]}
              ref={refs["how"]}
            >
              {Object.hasOwn(slots, "how") ? (
                slots["how"]
              ) : (
                <>
                  <div
                    className={"section-heading"}
                    {...bindings[".section-heading"]}
                  >
                    <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                      {"من البيانات إلى القرار"}
                    </p>
                    <h2
                      id={"how-title"}
                      {...bindings["how-title"]}
                      ref={refs["how-title"]}
                    >
                      {Object.hasOwn(slots, "how-title") ? (
                        slots["how-title"]
                      ) : (
                        <>
                          {"خطوات أقل."}
                          <br />
                          <span
                            className={"muted-title"}
                            {...bindings[".muted-title"]}
                          >
                            {"صورة أكمل."}
                          </span>
                        </>
                      )}
                    </h2>
                    <p>{"ابدأ باللي عندك، وافهم كل خطوة قبل ما تتخذ قرارك."}</p>
                  </div>
                  <div className={"steps"} {...bindings[".steps"]}>
                    <article className={"step"} {...bindings[".step"]}>
                      <span
                        className={"step-number"}
                        {...bindings[".step-number"]}
                      >
                        {"٠١"}
                      </span>
                      <div
                        className={"step-visual files-visual"}
                        aria-hidden={"true"}
                        {...bindings[".files-visual"]}
                        {...bindings[".step-visual"]}
                      >
                        <div
                          className={"file-chip"}
                          {...bindings[".file-chip"]}
                        >
                          <svg aria-hidden={"true"}>
                            <use href={"#file"} />
                          </svg>
                          {" المبيعات.csv"}
                        </div>
                        <div
                          className={"file-chip"}
                          {...bindings[".file-chip"]}
                        >
                          <svg aria-hidden={"true"}>
                            <use href={"#file"} />
                          </svg>
                          {" المخزون.csv"}
                        </div>
                        <div
                          className={"file-chip"}
                          {...bindings[".file-chip"]}
                        >
                          <svg aria-hidden={"true"}>
                            <use href={"#file"} />
                          </svg>
                          {" المصروفات.csv"}
                        </div>
                      </div>
                      <h3>{"جهّز بياناتك"}</h3>
                      <p>
                        {
                          "اجمع ملفاتك، وطابق الأعمدة، وراجع الملاحظات من مركز البيانات."
                        }
                      </p>
                    </article>
                    <article className={"step"} {...bindings[".step"]}>
                      <span
                        className={"step-number"}
                        {...bindings[".step-number"]}
                      >
                        {"٠٢"}
                      </span>
                      <div
                        className={"step-visual"}
                        {...bindings[".step-visual"]}
                      >
                        <div
                          className={"mini-insight"}
                          {...bindings[".mini-insight"]}
                        >
                          <span>{"فرصة تستحق المراجعة"}</span>
                          <strong>{"هدر المخزون"}</strong>
                          <div
                            className={"insight-meter"}
                            {...bindings[".insight-meter"]}
                          >
                            <i></i>
                          </div>
                          <small>{"السبب، المصدر، والأثر المتوقع"}</small>
                        </div>
                      </div>
                      <h3>{"افهم الفرصة"}</h3>
                      <p>
                        {
                          "استكشف كيف نعرض فرص التحسين وأسبابها، من خلال البيانات التجريبية."
                        }
                      </p>
                    </article>
                    <article className={"step"} {...bindings[".step"]}>
                      <span
                        className={"step-number"}
                        {...bindings[".step-number"]}
                      >
                        {"٠٣"}
                      </span>
                      <div
                        className={"step-visual"}
                        {...bindings[".step-visual"]}
                      >
                        <div
                          className={"mini-decision"}
                          {...bindings[".mini-decision"]}
                        >
                          <span>
                            <svg aria-hidden={"true"}>
                              <use href={"#check"} />
                            </svg>
                            {" الإجراء المقترح"}
                          </span>
                          <strong>{"راجع كميات الشراء"}</strong>
                          <small>{"قارنها بالاستهلاك الفعلي"}</small>
                        </div>
                      </div>
                      <h3>{"حدّد خطوتك التالية"}</h3>
                      <p>
                        {
                          "راجع الافتراضات، وحدّد الإجراء المناسب لمنشأتك والأثر المتوقع منه."
                        }
                      </p>
                    </article>
                  </div>
                </>
              )}
            </section>
            <section
              className={"opportunity-section section"}
              id={"opportunities"}
              aria-labelledby={"opportunities-title"}
              {...bindings[".section"]}
              {...bindings[".opportunity-section"]}
              {...bindings["opportunities"]}
              ref={refs["opportunities"]}
            >
              {Object.hasOwn(slots, "opportunities") ? (
                slots["opportunities"]
              ) : (
                <>
                  <div className={"container"} {...bindings[".container"]}>
                    <div
                      className={"section-heading reveal"}
                      {...bindings[".reveal"]}
                      {...bindings[".section-heading"]}
                    >
                      <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                        {"الرقم بداية الحكاية"}
                      </p>
                      <h2
                        id={"opportunities-title"}
                        {...bindings["opportunities-title"]}
                        ref={refs["opportunities-title"]}
                      >
                        {Object.hasOwn(slots, "opportunities-title") ? (
                          slots["opportunities-title"]
                        ) : (
                          <>
                            {"شوف الفرصة."}
                            <br />
                            <span
                              className={"muted-title"}
                              {...bindings[".muted-title"]}
                            >
                              {"وافهم اللي وراها."}
                            </span>
                          </>
                        )}
                      </h2>
                      <p>
                        {
                          "اختر مثالًا، وشوف كيف يتحول الرقم إلى إجراء قابل للمراجعة."
                        }
                      </p>
                    </div>
                    <div
                      className={"opportunity-demo reveal"}
                      {...bindings[".reveal"]}
                      {...bindings[".opportunity-demo"]}
                    >
                      <div
                        className={"opportunity-tabs"}
                        role={"tablist"}
                        aria-label={"أمثلة فرص التحسين"}
                        aria-orientation={"vertical"}
                        {...bindings[".opportunity-tabs"]}
                      >
                        <button
                          id={"op-tab-0"}
                          role={"tab"}
                          aria-selected={"true"}
                          aria-controls={"op-panel"}
                          data-op={"0"}
                          {...bindings["data-op:0"]}
                          {...bindings["op-tab-0"]}
                          ref={refs["op-tab-0"]}
                        >
                          {Object.hasOwn(slots, "op-tab-0") ? (
                            slots["op-tab-0"]
                          ) : (
                            <>
                              <span>
                                <small>{"٠١"}</small>
                                {"هدر المخزون"}
                              </span>
                              <b>
                                {"١٬٢٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </b>
                            </>
                          )}
                        </button>
                        <button
                          id={"op-tab-1"}
                          role={"tab"}
                          aria-selected={"false"}
                          tabIndex={"-1"}
                          aria-controls={"op-panel"}
                          data-op={"1"}
                          {...bindings["data-op:1"]}
                          {...bindings["op-tab-1"]}
                          ref={refs["op-tab-1"]}
                        >
                          {Object.hasOwn(slots, "op-tab-1") ? (
                            slots["op-tab-1"]
                          ) : (
                            <>
                              <span>
                                <small>{"٠٢"}</small>
                                {"تكلفة المنتجات"}
                              </span>
                              <b>
                                {"٨٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </b>
                            </>
                          )}
                        </button>
                        <button
                          id={"op-tab-2"}
                          role={"tab"}
                          aria-selected={"false"}
                          tabIndex={"-1"}
                          aria-controls={"op-panel"}
                          data-op={"2"}
                          {...bindings["data-op:2"]}
                          {...bindings["op-tab-2"]}
                          ref={refs["op-tab-2"]}
                        >
                          {Object.hasOwn(slots, "op-tab-2") ? (
                            slots["op-tab-2"]
                          ) : (
                            <>
                              <span>
                                <small>{"٠٣"}</small>
                                {"المصروفات"}
                              </span>
                              <b>
                                {"٥٠٠ "}
                                <span
                                  className={"riyal-symbol"}
                                  role={"img"}
                                  aria-label={"ريال سعودي"}
                                  {...bindings[".riyal-symbol"]}
                                ></span>
                              </b>
                            </>
                          )}
                        </button>
                        <p>
                          {"أمثلة من الديمو؛ الوفر مشروط بالافتراضات الموضحة."}
                        </p>
                      </div>
                      <article
                        className={"opportunity-detail"}
                        id={"op-panel"}
                        role={"tabpanel"}
                        tabIndex={"0"}
                        aria-labelledby={"op-tab-0"}
                        {...bindings[".opportunity-detail"]}
                        {...bindings["op-panel"]}
                        ref={refs["op-panel"]}
                      >
                        {Object.hasOwn(slots, "op-panel") ? (
                          slots["op-panel"]
                        ) : (
                          <>
                            <div
                              className={"detail-top"}
                              {...bindings[".detail-top"]}
                            >
                              <span
                                id={"op-category"}
                                {...bindings["op-category"]}
                                ref={refs["op-category"]}
                              >
                                {Object.hasOwn(slots, "op-category") ? (
                                  slots["op-category"]
                                ) : (
                                  <>{"هدر المخزون"}</>
                                )}
                              </span>
                              <span>{"مثال توضيحي"}</span>
                            </div>
                            <h3
                              id={"op-title"}
                              {...bindings["op-title"]}
                              ref={refs["op-title"]}
                            >
                              {Object.hasOwn(slots, "op-title") ? (
                                slots["op-title"]
                              ) : (
                                <>{"قلّل هدر المكونات"}</>
                              )}
                            </h3>
                            <p
                              id={"op-evidence"}
                              {...bindings["op-evidence"]}
                              ref={refs["op-evidence"]}
                            >
                              {Object.hasOwn(slots, "op-evidence") ? (
                                slots["op-evidence"]
                              ) : (
                                <>{"تكرر الهدر في ٣ مكونات خلال الشهر."}</>
                              )}
                            </p>
                            <div
                              className={"op-action"}
                              {...bindings[".op-action"]}
                            >
                              <span>{"خطوتك الأولى"}</span>
                              <p
                                id={"op-action"}
                                {...bindings["op-action"]}
                                ref={refs["op-action"]}
                              >
                                {Object.hasOwn(slots, "op-action") ? (
                                  slots["op-action"]
                                ) : (
                                  <>
                                    {
                                      "راجع كميات الشراء مقابل الاستهلاك الفعلي لكل مكون."
                                    }
                                  </>
                                )}
                              </p>
                            </div>
                            <div
                              className={"op-total"}
                              {...bindings[".op-total"]}
                            >
                              <div>
                                <span>{"وفر محتمل شهريًا"}</span>
                                <strong
                                  id={"op-amount"}
                                  {...bindings["op-amount"]}
                                  ref={refs["op-amount"]}
                                >
                                  {Object.hasOwn(slots, "op-amount") ? (
                                    slots["op-amount"]
                                  ) : (
                                    <>
                                      {"١٬٢٠٠ "}
                                      <span
                                        className={"riyal-symbol"}
                                        role={"img"}
                                        aria-label={"ريال سعودي"}
                                        {...bindings[".riyal-symbol"]}
                                      ></span>
                                    </>
                                  )}
                                </strong>
                              </div>
                              <a
                                className={"button button-light"}
                                id={"op-link"}
                                href={
                                  "opportunities.html?month=sep&opportunity=0"
                                }
                                {...bindings[".button-light"]}
                                {...bindings[".button"]}
                                {...bindings["op-link"]}
                                ref={refs["op-link"]}
                              >
                                {Object.hasOwn(slots, "op-link") ? (
                                  slots["op-link"]
                                ) : (
                                  <>{"راجع تفاصيل الفرصة"}</>
                                )}
                              </a>
                            </div>
                            <p
                              className={"op-calculation"}
                              id={"op-calculation"}
                              {...bindings[".op-calculation"]}
                              {...bindings["op-calculation"]}
                              ref={refs["op-calculation"]}
                            >
                              {Object.hasOwn(slots, "op-calculation") ? (
                                slots["op-calculation"]
                              ) : (
                                <>
                                  {"١٬٦٠٠ "}
                                  <span
                                    className={"riyal-symbol"}
                                    role={"img"}
                                    aria-label={"ريال سعودي"}
                                    {...bindings[".riyal-symbol"]}
                                  ></span>
                                  {" هدر مسجل × خفض مفترض ٧٥٪"}
                                </>
                              )}
                            </p>
                            <p
                              className={"sr-only"}
                              id={"op-announcement"}
                              aria-live={"polite"}
                              {...bindings[".sr-only"]}
                              {...bindings["op-announcement"]}
                              ref={refs["op-announcement"]}
                            >
                              {Object.hasOwn(slots, "op-announcement") ? (
                                slots["op-announcement"]
                              ) : (
                                <></>
                              )}
                            </p>
                          </>
                        )}
                      </article>
                    </div>
                  </div>
                </>
              )}
            </section>
            <section
              className={"section explore container reveal"}
              id={"explore"}
              aria-labelledby={"explore-title"}
              {...bindings[".reveal"]}
              {...bindings[".container"]}
              {...bindings[".explore"]}
              {...bindings[".section"]}
              {...bindings["explore"]}
              ref={refs["explore"]}
            >
              {Object.hasOwn(slots, "explore") ? (
                slots["explore"]
              ) : (
                <>
                  <div
                    className={"section-heading"}
                    {...bindings[".section-heading"]}
                  >
                    <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                      {"تفاصيلك متصلة بالصورة"}
                    </p>
                    <h2
                      id={"explore-title"}
                      {...bindings["explore-title"]}
                      ref={refs["explore-title"]}
                    >
                      {Object.hasOwn(slots, "explore-title") ? (
                        slots["explore-title"]
                      ) : (
                        <>
                          {"سؤال أوضح."}
                          <br />
                          <span
                            className={"muted-title"}
                            {...bindings[".muted-title"]}
                          >
                            {"قرار أقرب."}
                          </span>
                        </>
                      )}
                    </h2>
                    <p>
                      {
                        "من أداء الصنف إلى تكلفة التشغيل، استكشف التفاصيل اللي تهمّ منشأتك."
                      }
                    </p>
                  </div>
                  <div
                    className={"explore-tabs"}
                    role={"tablist"}
                    aria-label={"استكشف تفاصيل المنشأة"}
                    {...bindings[".explore-tabs"]}
                  >
                    <button
                      id={"explore-products"}
                      role={"tab"}
                      aria-selected={"true"}
                      aria-controls={"explore-panel"}
                      data-view={"products"}
                      {...bindings["data-view:products"]}
                      {...bindings["explore-products"]}
                      ref={refs["explore-products"]}
                    >
                      {Object.hasOwn(slots, "explore-products") ? (
                        slots["explore-products"]
                      ) : (
                        <>
                          <svg aria-hidden={"true"}>
                            <use href={"#box"} />
                          </svg>
                          {" المنتجات"}
                        </>
                      )}
                    </button>
                    <button
                      id={"explore-inventory"}
                      role={"tab"}
                      aria-selected={"false"}
                      tabIndex={"-1"}
                      aria-controls={"explore-panel"}
                      data-view={"inventory"}
                      {...bindings["data-view:inventory"]}
                      {...bindings["explore-inventory"]}
                      ref={refs["explore-inventory"]}
                    >
                      {Object.hasOwn(slots, "explore-inventory") ? (
                        slots["explore-inventory"]
                      ) : (
                        <>
                          <svg aria-hidden={"true"}>
                            <use href={"#database"} />
                          </svg>
                          {" المخزون"}
                        </>
                      )}
                    </button>
                    <button
                      id={"explore-expenses"}
                      role={"tab"}
                      aria-selected={"false"}
                      tabIndex={"-1"}
                      aria-controls={"explore-panel"}
                      data-view={"expenses"}
                      {...bindings["data-view:expenses"]}
                      {...bindings["explore-expenses"]}
                      ref={refs["explore-expenses"]}
                    >
                      {Object.hasOwn(slots, "explore-expenses") ? (
                        slots["explore-expenses"]
                      ) : (
                        <>
                          <svg aria-hidden={"true"}>
                            <use href={"#wallet"} />
                          </svg>
                          {" المصروفات"}
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    id={"explore-panel"}
                    className={"explore-panel"}
                    role={"tabpanel"}
                    tabIndex={"0"}
                    aria-labelledby={"explore-products"}
                    {...bindings[".explore-panel"]}
                    {...bindings["explore-panel"]}
                    ref={refs["explore-panel"]}
                  >
                    {Object.hasOwn(slots, "explore-panel") ? (
                      slots["explore-panel"]
                    ) : (
                      <>
                        <div
                          className={"explore-panel-head"}
                          {...bindings[".explore-panel-head"]}
                        >
                          <div>
                            <h3
                              id={"explore-question"}
                              {...bindings["explore-question"]}
                              ref={refs["explore-question"]}
                            >
                              {Object.hasOwn(slots, "explore-question") ? (
                                slots["explore-question"]
                              ) : (
                                <>{"أي صنف يحتاج مراجعة؟"}</>
                              )}
                            </h3>
                            <p
                              id={"explore-description"}
                              {...bindings["explore-description"]}
                              ref={refs["explore-description"]}
                            >
                              {Object.hasOwn(slots, "explore-description") ? (
                                slots["explore-description"]
                              ) : (
                                <>
                                  {
                                    "شوف هامش كل منتج، وحدّد الأصناف اللي تستحق انتباهك."
                                  }
                                </>
                              )}
                            </p>
                          </div>
                          <span
                            className={"sample-label"}
                            {...bindings[".sample-label"]}
                          >
                            {"بيانات توضيحية"}
                          </span>
                        </div>
                        <div
                          className={"table-scroll"}
                          tabIndex={"0"}
                          role={"region"}
                          aria-label={"معاينة بيانات المنشأة"}
                          {...bindings[".table-scroll"]}
                        >
                          <table>
                            <caption
                              className={"sr-only"}
                              id={"explore-caption"}
                              {...bindings[".sr-only"]}
                              {...bindings["explore-caption"]}
                              ref={refs["explore-caption"]}
                            >
                              {Object.hasOwn(slots, "explore-caption") ? (
                                slots["explore-caption"]
                              ) : (
                                <>{"عينة من المنتجات في سبتمبر ٢٠٢٦"}</>
                              )}
                            </caption>
                            <thead
                              id={"explore-head"}
                              {...bindings["explore-head"]}
                              ref={refs["explore-head"]}
                            >
                              {Object.hasOwn(slots, "explore-head") ? (
                                slots["explore-head"]
                              ) : (
                                <>
                                  <tr>
                                    <th>{"المنتج"}</th>
                                    <th>{"المبيعات"}</th>
                                    <th>{"الهامش"}</th>
                                    <th>{"الحالة"}</th>
                                  </tr>
                                </>
                              )}
                            </thead>
                            <tbody
                              id={"explore-body"}
                              {...bindings["explore-body"]}
                              ref={refs["explore-body"]}
                            >
                              {Object.hasOwn(slots, "explore-body") ? (
                                slots["explore-body"]
                              ) : (
                                <>
                                  <tr>
                                    <td>{"سلطة خضراء"}</td>
                                    <td>
                                      {"٤٬٠٠٠ "}
                                      <span
                                        className={"riyal-symbol"}
                                        role={"img"}
                                        aria-label={"ريال سعودي"}
                                        {...bindings[".riyal-symbol"]}
                                      ></span>
                                    </td>
                                    <td>{"١٢٫٥٪"}</td>
                                    <td>
                                      <span
                                        className={"table-status caution"}
                                        {...bindings[".caution"]}
                                        {...bindings[".table-status"]}
                                      >
                                        {"هامش منخفض"}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{"برجر دجاج"}</td>
                                    <td>
                                      {"١٢٬٠٠٠ "}
                                      <span
                                        className={"riyal-symbol"}
                                        role={"img"}
                                        aria-label={"ريال سعودي"}
                                        {...bindings[".riyal-symbol"]}
                                      ></span>
                                    </td>
                                    <td>{"٣٣٫٣٪"}</td>
                                    <td>
                                      <span
                                        className={"table-status"}
                                        {...bindings[".table-status"]}
                                      >
                                        {"ضمن المستهدف"}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{"باستا الدجاج"}</td>
                                    <td>
                                      {"٨٬٠٠٠ "}
                                      <span
                                        className={"riyal-symbol"}
                                        role={"img"}
                                        aria-label={"ريال سعودي"}
                                        {...bindings[".riyal-symbol"]}
                                      ></span>
                                    </td>
                                    <td>{"٦٢٫٥٪"}</td>
                                    <td>
                                      <span
                                        className={"table-status"}
                                        {...bindings[".table-status"]}
                                      >
                                        {"ضمن المستهدف"}
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div
                          className={"explore-panel-foot"}
                          {...bindings[".explore-panel-foot"]}
                        >
                          <p
                            id={"explore-footnote"}
                            {...bindings["explore-footnote"]}
                            ref={refs["explore-footnote"]}
                          >
                            {Object.hasOwn(slots, "explore-footnote") ? (
                              slots["explore-footnote"]
                            ) : (
                              <>
                                {"الهامش قبل المصروفات العامة والهدر المنفصل."}
                              </>
                            )}
                          </p>
                          <a
                            id={"explore-link"}
                            href={"products.html?month=sep"}
                            {...bindings["explore-link"]}
                            ref={refs["explore-link"]}
                          >
                            {Object.hasOwn(slots, "explore-link") ? (
                              slots["explore-link"]
                            ) : (
                              <>{"استكشف المنتجات"}</>
                            )}
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </section>
            <section
              className={"advisor-section section"}
              id={"advisor"}
              aria-labelledby={"advisor-title"}
              {...bindings[".section"]}
              {...bindings[".advisor-section"]}
              {...bindings["advisor"]}
              ref={refs["advisor"]}
            >
              {Object.hasOwn(slots, "advisor") ? (
                slots["advisor"]
              ) : (
                <>
                  <div
                    className={"container advisor-grid"}
                    {...bindings[".advisor-grid"]}
                    {...bindings[".container"]}
                  >
                    <div
                      className={"advisor-copy reveal"}
                      {...bindings[".reveal"]}
                      {...bindings[".advisor-copy"]}
                    >
                      <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                        {"مساحة القرار"}
                      </p>
                      <h2
                        id={"advisor-title"}
                        {...bindings["advisor-title"]}
                        ref={refs["advisor-title"]}
                      >
                        {Object.hasOwn(slots, "advisor-title") ? (
                          slots["advisor-title"]
                        ) : (
                          <>
                            {"خذ مكانك."}
                            <br />
                            <span>{"وتعرّف على جدوى."}</span>
                          </>
                        )}
                      </h2>
                      <p>
                        {
                          "مساحة اجتماع ثلاثية الأبعاد، ومستشارك قدّامك. استكشف المكان والشخصية، وشوف كيف نجهّز لتجربة الحوار حول بيانات منشأتك."
                        }
                      </p>
                      <a
                        className={"button button-light"}
                        href={"meeting.html?mode=demo&month=sep"}
                        {...bindings[".button-light"]}
                        {...bindings[".button"]}
                      >
                        {"استكشف غرفة جدوى"}
                      </a>
                      <small>
                        {
                          "معاينة تفاعلية · المحادثة النصية والصوتية قيد التطوير"
                        }
                      </small>
                    </div>
                    <a
                      className={"advisor-preview reveal"}
                      href={"meeting.html?mode=demo&month=sep"}
                      aria-label={"افتح معاينة غرفة اجتماع جدوى"}
                      {...bindings[".reveal"]}
                      {...bindings[".advisor-preview"]}
                    >
                      <img
                        src={"assets/jadwa-meeting-preview.jpg"}
                        width={"1440"}
                        height={"900"}
                        loading={"lazy"}
                        decoding={"async"}
                        alt={
                          "مستشار جدوى الروبوت أمامك في غرفة اجتماع مضيئة، مع لابتوب ونبتة وكرات نيوتن"
                        }
                      />
                      <span>
                        <svg aria-hidden={"true"}>
                          <use href={"#video"} />
                        </svg>
                        {" ادخل المكان"}
                      </span>
                    </a>
                  </div>
                </>
              )}
            </section>
            <section
              className={"section container closing reveal"}
              aria-labelledby={"closing-title"}
              {...bindings[".reveal"]}
              {...bindings[".closing"]}
              {...bindings[".container"]}
              {...bindings[".section"]}
            >
              <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                {"ابدأ بصورة أوضح"}
              </p>
              <h2
                id={"closing-title"}
                {...bindings["closing-title"]}
                ref={refs["closing-title"]}
              >
                {Object.hasOwn(slots, "closing-title") ? (
                  slots["closing-title"]
                ) : (
                  <>
                    {"فرصتك الجاية،"}
                    <br />
                    <span className={"accent"} {...bindings[".accent"]}>
                      {"يمكن تكون في أرقامك."}
                    </span>
                  </>
                )}
              </h2>
              <p>{"جرّب بيانات جاهزة، واستكشف جدوى بنفسك."}</p>
              <a
                className={"button"}
                href={"register.html"}
                {...bindings[".button"]}
              >
                {"ابدأ مع جدوى"}
              </a>
              <small>
                <a href={"dashboard.html"}>{"أو ادخل كزائر بدون حساب"}</a>
              </small>
            </section>
            <section
              className={"faq container reveal"}
              aria-labelledby={"faq-title"}
              {...bindings[".reveal"]}
              {...bindings[".container"]}
              {...bindings[".faq"]}
            >
              <div>
                <p className={"eyebrow"} {...bindings[".eyebrow"]}>
                  {"قبل ما تبدأ"}
                </p>
                <h2
                  id={"faq-title"}
                  {...bindings["faq-title"]}
                  ref={refs["faq-title"]}
                >
                  {Object.hasOwn(slots, "faq-title") ? (
                    slots["faq-title"]
                  ) : (
                    <>{"أسئلة في بالك؟"}</>
                  )}
                </h2>
              </div>
              <div className={"faq-list"} {...bindings[".faq-list"]}>
                <details>
                  <summary>
                    {"وش أقدر أجرّب الآن؟"}
                    <span aria-hidden={"true"}>{"+"}</span>
                  </summary>
                  <p>
                    {
                      "تقدر تتنقل بين لوحة التحكم وفرص التحسين والمنتجات والمخزون والمصروفات باستخدام بيانات توضيحية، وتجهّز ملفاتك في مركز البيانات، وتستكشف غرفة الاجتماع."
                    }
                  </p>
                </details>
                <details>
                  <summary>
                    {"هل أقدر أستخدم ملفاتي؟"}
                    <span aria-hidden={"true"}>{"+"}</span>
                  </summary>
                  <p>
                    {
                      "مركز البيانات يقبل CSV بترميز UTF-8. صدّر ملف Excel بهذه الصيغة، ثم طابق الأعمدة وراجع البيانات. الملفات تُجهّز داخل جهازك وتُحفظ مؤقتًا في هذا التبويب؛ ربطها بالتحليلات والحفظ الدائم غير متاحين بعد."
                    }
                  </p>
                </details>
                <details>
                  <summary>
                    {"هل الأرقام المعروضة نتائج فعلية؟"}
                    <span aria-hidden={"true"}>{"+"}</span>
                  </summary>
                  <p>
                    {
                      "الأرقام أمثلة توضيحية من بيانات الديمو. مبالغ الوفر تقديرية وتعتمد على افتراضات موضحة داخل كل فرصة، ولا تمثل وفرًا محققًا أو نتيجة مضمونة."
                    }
                  </p>
                </details>
                <details>
                  <summary>
                    {"هل أقدر أتكلم مع جدوى؟"}
                    <span aria-hidden={"true"}>{"+"}</span>
                  </summary>
                  <p>
                    {
                      "حاليًا تقدر تستكشف الغرفة والشخصية وحركاتها. ربط الذكاء الاصطناعي والمحادثة النصية والصوتية هو المرحلة القادمة."
                    }
                  </p>
                </details>
              </div>
            </section>
          </>
        )}
      </main>
      <footer
        ref={refs.footer}
        className={"site-footer container"}
        {...bindings[".container"]}
        {...bindings[".site-footer"]}
      >
        <a
          className={"brand"}
          href={"index.html"}
          aria-label={"جدوى الرئيسية"}
          {...bindings[".brand"]}
        >
          <svg
            className={"brand-art"}
            viewBox={"230 335 995 380"}
            role={"img"}
            aria-label={"جدوى"}
            {...bindings[".brand-art"]}
          >
            <image
              href={"assets/jadwa-logo.png"}
              width={"1448"}
              height={"1086"}
            ></image>
          </svg>
        </a>
        <p>{"قرارات أوضح، رؤية أذكى."}</p>
        <a href={"dashboard.html"}>{"استكشف النسخة التجريبية"}</a>
        <small>{"جدوى © ٢٠٢٦"}</small>
      </footer>
    </>
  );
}
