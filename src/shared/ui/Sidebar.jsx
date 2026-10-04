import { Riyal } from "./primitives.jsx";
export default function Sidebar({ active, bindings = {} }) {
  bindings = { ...bindings };
  for (const [key, name] of Object.entries({
    "data-action:opportunities": "opportunities",
    "data-catalog": "catalog",
    "data-expenses": "expenses",
    "data-action:data": "data-hub",
  })) {
    bindings[key] = {
      ...bindings[key],
      className: "nav-item" + (active === name ? " active" : ""),
      "aria-current": active === name ? "page" : undefined,
    };
  }
  const slots = {},
    refs = { sidebar: bindings.sidebar?.ref };
  return (
    <aside
      className={"sidebar"}
      id={"sidebar"}
      {...bindings[".sidebar"]}
      {...bindings["sidebar"]}
      ref={refs["sidebar"]}
    >
      {Object.hasOwn(slots, "sidebar") ? (
        slots["sidebar"]
      ) : (
        <>
          <a
            className={"logo"}
            data-home={""}
            href={"dashboard.html"}
            aria-label={"جدوى الرئيسية"}
            {...bindings[".logo"]}
            {...bindings["data-home"]}
          >
            <img src={"assets/jadwa-logo.png"} alt={"جدوى"} />
          </a>
          <div className={"workspace"} {...bindings[".workspace"]}>
            <span className={"workspace-icon"} {...bindings[".workspace-icon"]}>
              {"م"}
            </span>
            <span>
              <b>{"منشأتي"}</b>
              <small>{"مساحة العمل التجريبية"}</small>
            </span>
            <span
              className={"workspace-badge"}
              {...bindings[".workspace-badge"]}
            >
              {"تجريبي"}
            </span>
          </div>
          <p className={"nav-caption"} {...bindings[".nav-caption"]}>
            {"مساحة العمل"}
          </p>
          <nav aria-label={"التنقل الرئيسي"}>
            <button
              className={"nav-item" + (active === "dashboard" ? " active" : "")}
              aria-current={active === "dashboard" ? "page" : undefined}
              data-home={""}
              {...bindings[".nav-item"]}
              {...bindings["data-home"]}
            >
              <svg>
                <use href={"#home"} />
              </svg>
              {"الرئيسية"}
            </button>
            <button
              className={"nav-item"}
              data-action={"opportunities"}
              {...bindings[".nav-item"]}
              {...bindings["data-action:opportunities"]}
            >
              <svg>
                <use href={"#spark"} />
              </svg>
              {"فرص التحسين"}
              <span className={"count"} {...bindings[".count"]}>
                {"٣"}
              </span>
            </button>
            <button
              className={"nav-item"}
              data-catalog={""}
              {...bindings[".nav-item"]}
              {...bindings["data-catalog"]}
            >
              <svg>
                <use href={"#box"} />
              </svg>
              {"المنتجات والمخزون"}
            </button>
            <button
              className={"nav-item"}
              data-expenses={""}
              {...bindings[".nav-item"]}
              {...bindings["data-expenses"]}
            >
              <svg>
                <use href={"#wallet"} />
              </svg>
              {"المصروفات"}
            </button>
            <button
              className={"nav-item"}
              data-action={"data"}
              {...bindings[".active"]}
              {...bindings[".nav-item"]}
              {...bindings["data-action:data"]}
            >
              <svg>
                <use href={"#database"} />
              </svg>
              {"مركز البيانات"}
            </button>
          </nav>
          <div className={"sidebar-bottom"} {...bindings[".sidebar-bottom"]}>
            <div className={"brand-note"} {...bindings[".brand-note"]}>
              <span>{"قرارات أوضح."}</span>
              <strong>{"رؤية أذكى."}</strong>
              <div className={"brand-colors"} {...bindings[".brand-colors"]}>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
            <div className={"profile"} {...bindings[".profile"]}>
              <span className={"avatar"} {...bindings[".avatar"]}>
                {"ش"}
              </span>
              <div>
                <b>{"الشيماء"}</b>
                <small>{"مالكة المنشأة"}</small>
              </div>
              <span className={"profile-mark"} {...bindings[".profile-mark"]}>
                {"جدوى"}
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
