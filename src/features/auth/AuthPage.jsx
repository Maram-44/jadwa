import { useState, useRef } from "react";
import LoginView from "./components/LoginView.jsx";
import RegisterView from "./components/RegisterView.jsx";
import { useAuth } from "../../shared/lib/authContext.jsx";
import { loginSchema, registerSchema, passwordResetSchema } from "./schemas/authSchemas.js";

export default function AuthPage({ mode }) {
  const register = mode === "register";
  const ids = register
    ? ["full-name", "email", "password", "confirm-password"]
    : ["email", "password"];

  const { login, register: authRegister, loginAsGuest, resetPassword } = useAuth();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [shown, setShown] = useState({});
  const [message, setMessage] = useState(() => {
    if (!register && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        return "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.";
      }
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const inputs = useRef({});

  function getZodIssues(error) {
    if (!error) return [];
    return error.issues || error.errors || [];
  }

  function validateAll() {
    const schema = register ? registerSchema : loginSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = {};
      const issues = getZodIssues(result.error);
      issues.forEach((err) => {
        const fieldName = err.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      return fieldErrors;
    }
    return {};
  }

  function validateField(id, val) {
    const current = { ...values, [id]: val };
    const schema = register ? registerSchema : loginSchema;
    const result = schema.safeParse(current);
    if (!result.success) {
      const issues = getZodIssues(result.error);
      const err = issues.find((e) => e.path[0] === id);
      return err ? err.message : "";
    }
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const fieldErrors = validateAll();
    setErrors(fieldErrors);

    const first = ids.find((id) => fieldErrors[id]);
    if (first) {
      setMessage("");
      inputs.current[first]?.focus();
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (register) {
        const res = await authRegister({
          email: values.email,
          password: values.password,
          fullName: values["full-name"],
        });

        if (res.error) {
          setMessage(res.error);
          setLoading(false);
          return;
        }

        // Successfully registered -> redirect to login with confirmation
        location.href = "login.html?registered=true";
      } else {
        const res = await login({
          email: values.email,
          password: values.password,
        });

        if (res.error) {
          setMessage(res.error === "Invalid login credentials"
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : res.error);
          setLoading(false);
          return;
        }

        // Successfully logged in -> redirect to dashboard
        location.href = "dashboard.html";
      }
    } catch (err) {
      setMessage("حدث خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  async function handleGuest(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginAsGuest();
      if (res?.error) {
        setMessage(res.error === "Invalid login credentials"
          ? "تعذر الدخول بحساب الزائر التجريبي."
          : res.error);
        setLoading(false);
        return;
      }
      location.href = "dashboard.html";
    } catch {
      setMessage("تعذر الدخول بحساب الزائر التجريبي. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  const isSuccessMessage = message === "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.";

  const bindings = {
    "auth-form": { onSubmit: submit },
    "submit-auth": { disabled: loading },
    "form-message": {
      hidden: !message,
      style: isSuccessMessage
        ? { background: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }
        : undefined,
    },
    ".button-guest": {
      onClick: handleGuest,
      style: loading ? { pointerEvents: "none", opacity: 0.7 } : undefined,
    },
  };

  const slots = {
    "form-message": message,
    "submit-auth": loading
      ? (register ? "جارٍ إنشاء الحساب…" : "جارٍ تسجيل الدخول…")
      : (register ? "إنشاء حساب" : "تسجيل الدخول"),
  };

  const refs = {};

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
          if (old[id]) next[id] = validateField(id, value);
          if (id === "password" && values["confirm-password"]) {
            next["confirm-password"] =
              values["confirm-password"] === value
                ? ""
                : "كلمتا المرور غير متطابقتين.";
          }
          return next;
        });
      },
      onBlur: () => {
        if (values[id] || Object.hasOwn(errors, id)) {
          setErrors((v) => ({ ...v, [id]: validateField(id, values[id] || "") }));
        }
      },
      "aria-invalid": errors[id] ? true : undefined,
      disabled: loading,
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
  return <View slots={slots} bindings={bindings} refs={refs} loading={loading} />;
}
