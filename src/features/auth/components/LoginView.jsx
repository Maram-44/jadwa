import { Riyal, Skeleton } from "../../../shared/ui/primitives.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Dialog from "../../../shared/ui/Dialog.jsx";
import Sidebar from "../../../shared/ui/Sidebar.jsx";
import IconDefinitions from "../../../shared/ui/IconDefinitions.jsx";
export default function LoginView({
  slots = {},
  bindings = {},
  refs = {},
  active,
  loading = false,
}) {
  return (
    <>
      <IconDefinitions />
      <div className={"auth-shell"} {...bindings[".auth-shell"]}>
        <section
          className={"auth-main"}
          aria-labelledby={"auth-title"}
          {...bindings[".auth-main"]}
        >
          <header className={"auth-header"} {...bindings[".auth-header"]}>
            <a
              className={"brand"}
              href={"index.html"}
              aria-label={"جدوى — العودة للرئيسية"}
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
            <a
              className={"back-link"}
              href={"index.html"}
              {...bindings[".back-link"]}
            >
              {"العودة للرئيسية"}
            </a>
          </header>
          <main className={"form-area"} {...bindings[".form-area"]}>
            <span className={"eyebrow"} {...bindings[".eyebrow"]}>
              {"قرارات أوضح تبدأ من هنا"}
            </span>
            <h1
              id={"auth-title"}
              {...bindings["auth-title"]}
              ref={refs["auth-title"]}
            >
              {Object.hasOwn(slots, "auth-title") ? (
                slots["auth-title"]
              ) : (
                <>
                  {"حيّاك في جدوى"}
                  <span>{"."}</span>
                </>
              )}
            </h1>
            <p className={"intro-copy"} {...bindings[".intro-copy"]}>
              {"كل تفاصيل منشأتك، في مكان واحد."}
            </p>
            <div className={"demo-note"} {...bindings[".demo-note"]}>
              <span className={"demo-dot"} {...bindings[".demo-dot"]}></span>
              <p>
                <b>{"معاينة تجريبية"}</b>
                {
                  " الحسابات غير مفعّلة بعد. استخدم بيانات تجريبية؛ لن تُرسل أو تُحفظ."
                }
              </p>
            </div>
            <form
              id={"auth-form"}
              data-mode={"login"}
              noValidate
              {...bindings["data-mode:login"]}
              {...bindings["auth-form"]}
              ref={refs["auth-form"]}
            >
              {Object.hasOwn(slots, "auth-form") ? (
                slots["auth-form"]
              ) : (
                <>
                  <div className={"field"} {...bindings[".field"]}>
                    <label htmlFor={"email"}>{"البريد الإلكتروني"}</label>
                    <div className={"input-wrap"} {...bindings[".input-wrap"]}>
                      <input
                        id={"email"}
                        type={"email"}
                        placeholder={"name@example.com"}
                        autoComplete={"email"}
                        required={true}
                        maxLength={"254"}
                        aria-describedby={"email-error"}
                        dir={"ltr"}
                        {...bindings["email"]}
                        ref={refs["email"]}
                      />
                    </div>
                    <p
                      className={"field-error"}
                      id={"email-error"}
                      hidden={true}
                      {...bindings[".field-error"]}
                      {...bindings["email-error"]}
                      ref={refs["email-error"]}
                    >
                      {Object.hasOwn(slots, "email-error") ? (
                        slots["email-error"]
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                  <div className={"field"} {...bindings[".field"]}>
                    <label htmlFor={"password"}>{"كلمة المرور"}</label>
                    <div className={"input-wrap"} {...bindings[".input-wrap"]}>
                      <input
                        id={"password"}
                        type={"password"}
                        placeholder={"أدخل كلمة مرور تجريبية"}
                        autoComplete={"current-password"}
                        required={true}
                        minLength={"8"}
                        maxLength={"128"}
                        aria-describedby={"password-error"}
                        dir={"ltr"}
                        {...bindings["password"]}
                        ref={refs["password"]}
                      />
                      <button
                        className={"password-toggle"}
                        type={"button"}
                        data-password={"password"}
                        aria-label={"إظهار كلمة المرور"}
                        aria-pressed={"false"}
                        {...bindings[".password-toggle"]}
                        {...bindings["data-password:password"]}
                      >
                        <svg aria-hidden={"true"}>
                          <use href={"#eye"} />
                        </svg>
                      </button>
                    </div>
                    <p
                      className={"field-error"}
                      id={"password-error"}
                      hidden={true}
                      {...bindings[".field-error"]}
                      {...bindings["password-error"]}
                      ref={refs["password-error"]}
                    >
                      {Object.hasOwn(slots, "password-error") ? (
                        slots["password-error"]
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                  <div
                    className={"form-message"}
                    id={"form-message"}
                    role={"status"}
                    aria-live={"polite"}
                    hidden={true}
                    {...bindings[".form-message"]}
                    {...bindings["form-message"]}
                    ref={refs["form-message"]}
                  >
                    {Object.hasOwn(slots, "form-message") ? (
                      slots["form-message"]
                    ) : (
                      <></>
                    )}
                  </div>
                  <button
                    className={"button button-primary"}
                    id={"submit-auth"}
                    type={"submit"}
                    disabled={true}
                    {...bindings[".button-primary"]}
                    {...bindings[".button"]}
                    {...bindings["submit-auth"]}
                    ref={refs["submit-auth"]}
                  >
                    {Object.hasOwn(slots, "submit-auth") ? (
                      slots["submit-auth"]
                    ) : (
                      <>{"تسجيل الدخول"}</>
                    )}
                  </button>
                </>
              )}
            </form>
            <p className={"switch-auth"} {...bindings[".switch-auth"]}>
              {"أول مرة مع جدوى؟ "}
              <a href={"register.html"}>{"أنشئ حسابًا جديدًا"}</a>
            </p>
            <div className={"divider"} {...bindings[".divider"]}>
              <span>{"أو استكشفها أولًا"}</span>
            </div>
            <a
              className={"button button-guest"}
              href={"dashboard.html"}
              {...bindings[".button-guest"]}
              {...bindings[".button"]}
            >
              <svg aria-hidden={"true"}>
                <use href={"#guest"} />
              </svg>
              {"الدخول كزائر"}
            </a>
            <p className={"guest-note"} {...bindings[".guest-note"]}>
              {"تصفّح الديمو ببيانات جاهزة، بدون حساب."}
            </p>
          </main>
          <footer className={"auth-footer"} {...bindings[".auth-footer"]}>
            {"جدوى © ٢٠٢٦ "}
            <span>{"قرارات أوضح، رؤية أذكى."}</span>
          </footer>
        </section>
        <aside
          className={"auth-story"}
          aria-label={"اكتشف جدوى"}
          {...bindings[".auth-story"]}
        >
          <div className={"story-top"} {...bindings[".story-top"]}>
            <span>{"منشأتك، بصورة أوضح"}</span>
            <span className={"story-edition"} {...bindings[".story-edition"]}>
              {"جدوى / ٠١"}
            </span>
          </div>
          <div className={"story-content"} {...bindings[".story-content"]}>
            <p className={"story-eyebrow"} {...bindings[".story-eyebrow"]}>
              {"من البيانات إلى القرار"}
            </p>
            <h2>
              {"اعرف وين يروح ربحك."}
              <br />
              <span>{"وشوف فرصتك الجاية."}</span>
            </h2>
            <p
              className={"story-description"}
              {...bindings[".story-description"]}
            >
              {
                "اجمع الصورة من مبيعاتك ومصاريفك ومخزونك، وابدأ بالخطوة اللي تصنع فرقًا."
              }
            </p>
            <div
              className={"saving-card"}
              {...bindings[".saving-card"]}
              inert={loading}
              className={"saving-card" + (loading ? " is-loading" : "")}
            >
              <div className={"saving-head"} {...bindings[".saving-head"]}>
                <span>{"وفر محتمل هذا الشهر"}</span>
                <span className={"sample"} {...bindings[".sample"]}>
                  {"مثال توضيحي"}
                </span>
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
              <div
                className={"saving-bar"}
                aria-hidden={"true"}
                {...bindings[".saving-bar"]}
              >
                <i></i>
                <i></i>
                <i></i>
              </div>
              <ul>
                <li>
                  <span>
                    <i
                      className={"legend mint"}
                      {...bindings[".mint"]}
                      {...bindings[".legend"]}
                    ></i>
                    {"هدر المخزون"}
                  </span>
                  <b>{"١٬٢٠٠"}</b>
                </li>
                <li>
                  <span>
                    <i
                      className={"legend blue"}
                      {...bindings[".blue"]}
                      {...bindings[".legend"]}
                    ></i>
                    {"تكلفة المنتجات"}
                  </span>
                  <b>{"٨٠٠"}</b>
                </li>
                <li>
                  <span>
                    <i
                      className={"legend gold"}
                      {...bindings[".gold"]}
                      {...bindings[".legend"]}
                    ></i>
                    {"المصروفات"}
                  </span>
                  <b>{"٥٠٠"}</b>
                </li>
              </ul>
              <p>{"تقديرات من بيانات الديمو، وليست وفرًا محققًا."}</p>
              {loading && <Skeleton chart={false} />}
            </div>
            <div className={"story-points"} {...bindings[".story-points"]}>
              <span>
                <svg aria-hidden={"true"}>
                  <use href={"#check"} />
                </svg>
                {"افهم السبب"}
              </span>
              <span>
                <svg aria-hidden={"true"}>
                  <use href={"#check"} />
                </svg>
                {"راجع التوصية"}
              </span>
              <span>
                <svg aria-hidden={"true"}>
                  <use href={"#check"} />
                </svg>
                {"خذ خطوتك"}
              </span>
            </div>
          </div>
          <p className={"story-bottom"} {...bindings[".story-bottom"]}>
            {"أرقام أقل تشتتًا. قرارات أكثر وضوحًا."}
          </p>
        </aside>
      </div>
    </>
  );
}
