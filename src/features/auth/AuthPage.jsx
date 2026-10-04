import { useState, useRef } from "react";
import LoginView from "./components/LoginView.jsx";
import RegisterView from "./components/RegisterView.jsx";
export default function AuthPage({ mode }) {
  const register = mode === "register";
  const ids = register
    ? ["full-name", "email", "password", "confirm-password"]
    : ["email", "password"];
  const [values, setValues] = useState({}),
    [errors, setErrors] = useState({}),
    [shown, setShown] = useState({}),
    [message, setMessage] = useState("");
  const inputs = useRef({});
  function error(id, value = values[id] || "") {
    if (!value.trim()) return "هذا الحقل مطلوب.";
    if (id === "email" && inputs.current[id]?.validity.typeMismatch)
      return "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.";
    if (id === "full-name" && value.trim().length < 2)
      return "أدخل اسمًا من حرفين على الأقل.";
    if (id === "password" && value.length < 8)
      return "استخدم ٨ أحرف على الأقل في هذه المعاينة.";
    if (id === "confirm-password" && value !== (values.password || ""))
      return "كلمتا المرور غير متطابقتين.";
    return "";
  }
  function submit(e) {
    e.preventDefault();
    const next = Object.fromEntries(ids.map((id) => [id, error(id)]));
    setErrors(next);
    const first = ids.find((id) => next[id]);
    if (first) {
      setMessage("");
      inputs.current[first]?.focus();
      return;
    }
    setMessage(
      register
        ? "اكتملت الحقول، لكن إنشاء الحسابات لم يُفعّل بعد. يمكنك استكشاف جدوى الآن عبر «الدخول كزائر»."
        : "تسجيل الدخول غير مفعّل في هذه النسخة. اختر «الدخول كزائر» لتجربة لوحة التحكم.",
    );
    setValues((v) => ({ ...v, password: "", "confirm-password": "" }));
    setShown({});
  }
  const bindings = {
      "auth-form": { onSubmit: submit },
      "submit-auth": { disabled: false },
      "form-message": { hidden: !message },
    },
    slots = { "form-message": message },
    refs = {};
  for (const id of ids) {
    refs[id] = (el) => (inputs.current[id] = el);
    bindings[id] = {
      value: values[id] || "",
      onChange: (e) => {
        const value = e.target.value;
        setValues((v) => ({ ...v, [id]: value }));
        setMessage("");
        setErrors((old) => {
          const next = { ...old };
          if (old[id]) next[id] = error(id, value);
          if (id === "password" && values["confirm-password"])
            next["confirm-password"] =
              values["confirm-password"] === value
                ? ""
                : "كلمتا المرور غير متطابقتين.";
          return next;
        });
      },
      onBlur: () => {
        if (values[id] || Object.hasOwn(errors, id))
          setErrors((v) => ({ ...v, [id]: error(id) }));
      },
      "aria-invalid": errors[id] ? true : undefined,
    };
    bindings[id + "-error"] = { hidden: !errors[id] };
    slots[id + "-error"] = errors[id] || "";
    if (id.includes("password")) {
      bindings[id].type = shown[id] ? "text" : "password";
      bindings[id]["data-password-field"] = "";
      bindings["data-password:" + id] = {
        onClick: () => setShown((v) => ({ ...v, [id]: !v[id] })),
        "aria-pressed": !!shown[id],
        "aria-label":
          (shown[id] ? "إخفاء " : "إظهار ") +
          (id === "confirm-password" ? "تأكيد كلمة المرور" : "كلمة المرور"),
      };
    }
  }
  const View = register ? RegisterView : LoginView;
  return <View slots={slots} bindings={bindings} refs={refs} />;
}
