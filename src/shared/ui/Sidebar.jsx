import { Riyal } from "./primitives.jsx";
import { useAuth } from "../lib/authContext.jsx";
import { computeAvatarInitial } from "../types/dto.js";

export default function Sidebar({ active, bindings = {} }) {
  const { user, logout } = useAuth();
  const profile = user?.profile || {};
  const isGuest = user?.isGuest ?? false;
  const fullName = profile.fullName || (isGuest ? "الشيماء" : (user?.email?.split("@")[0] || "مستخدم"));
  const businessName = profile.businessName || "منشأتي";
  const role = profile.role || (isGuest ? "مالكة المنشأة" : "مستخدم المنشأة");
  const avatarInitial = isGuest
    ? "ش"
    : (computeAvatarInitial(profile.fullName, user?.email) || (fullName ? fullName.charAt(0) : "م"));
  const workspaceInitial = businessName.charAt(0) || "م";
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
              {workspaceInitial}
            </span>
            <span>
              <b>{businessName}</b>
              <small>{isGuest ? "مساحة العمل التجريبية" : "مساحة العمل"}</small>
            </span>
            <span
              className={"workspace-badge"}
              style={!isGuest ? { color: "#0b9875", borderColor: "#a7f3d0", background: "#ecfdf5" } : undefined}
              {...bindings[".workspace-badge"]}
            >
              {isGuest ? "تجريبي" : "نشط"}
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
                {avatarInitial}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {fullName}
                </b>
                <small>{role}</small>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={logout}
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "6px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  marginRight: "auto",
                }}
              >
                <svg style={{ width: "18px", height: "18px" }}>
                  <use href={"#logout"} />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="sidebar-logout-button"
              onClick={logout}
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "10px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
            >
              <svg style={{ width: "16px", height: "16px" }}>
                <use href={"#logout"} />
              </svg>
              <span>{"تسجيل الخروج"}</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
