import { useState, useEffect, useRef } from "react";
export function useQuery() {
  const [query, set] = useState(() => new URLSearchParams(location.search));
  useEffect(() => {
    const pop = () => set(new URLSearchParams(location.search));
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, []);
  const update = (values) => {
    const next = new URLSearchParams(query);
    Object.entries(values).forEach(([k, v]) =>
      v === null ? next.delete(k) : next.set(k, v),
    );
    history.replaceState(null, "", "?" + next);
    set(next);
  };
  return [query, update];
}
export function useLoading(key, ms) {
  const [pending, set] = useState(true);
  useEffect(() => {
    set(true);
    const timer = setTimeout(() => set(false), ms);
    return () => clearTimeout(timer);
  }, [key, ms]);
  return pending;
}
export function useToast(ms = 2500) {
  const [toast, set] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  return [
    toast,
    (text) => {
      clearTimeout(timer.current);
      set(text);
      timer.current = setTimeout(() => set(""), ms);
    },
  ];
}
export function useWorkspace(month, active) {
  const [open, setOpen] = useState(false),
    [info, setInfo] = useState(null);
  const sidebar = useRef(),
    menu = useRef();
  useEffect(() => {
    const outside = (e) => {
        if (
          !sidebar.current?.contains(e.target) &&
          !menu.current?.contains(e.target)
        )
          setOpen(false);
      },
      key = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
    document.addEventListener("click", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", key);
    };
  }, []);
  const go = (page) => {
    setOpen(false);
    location.href = page + ".html?month=" + month;
  };
  const binding = (name, page) => ({
    onClick: (e) => {
      e.preventDefault();
      active === name
        ? (setOpen(false), window.scrollTo({ top: 0, behavior: "smooth" }))
        : go(page);
    },
  });
  const home = {
    onClick: (e) => {
      e.preventDefault();
      go("dashboard");
    },
    href: "dashboard.html?month=" + month,
  };
  return {
    info,
    setInfo,
    closeMenu: () => setOpen(false),
    bindings: {
      "data-home": home,
      "data-action:opportunities": binding("opportunities", "opportunities"),
      "data-catalog": binding("catalog", "products"),
      "data-expenses": binding("expenses", "expenses"),
      "data-action:data": binding("data-hub", "data-hub"),
      sidebar: { className: "sidebar" + (open ? " open" : ""), ref: sidebar },
      "menu-button": {
        onClick: () => setOpen(!open),
        "aria-expanded": open,
        ref: menu,
      },
      "close-dialog": { onClick: () => setInfo(null) },
      "detail-dialog": { open: !!info, onClose: () => setInfo(null) },
    },
    refs: { sidebar, "menu-button": menu },
  };
}
