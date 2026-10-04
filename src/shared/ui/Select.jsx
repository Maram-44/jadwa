import {
  Children,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
const Select = forwardRef(function Select(
  {
    id,
    value,
    defaultValue,
    onChange,
    children,
    disabled,
    hidden,
    "aria-label": label,
    ...props
  },
  forwarded,
) {
  const trigger = useRef(),
    list = useRef(),
    search = useRef(""),
    timer = useRef();
  useImperativeHandle(forwarded, () => trigger.current);
  const flatten = (nodes) =>
    Children.toArray(nodes).flatMap((n) =>
      n?.type === "option"
        ? [n]
        : n?.props?.children
          ? flatten(n.props.children)
          : [],
    );
  const options = flatten(children);
  const selected = String(
    value ?? defaultValue ?? options[0]?.props.value ?? "",
  );
  const index = options.findIndex((o) => String(o.props.value) === selected);
  const enabled = options
    .map((o, i) => (!o.props.disabled && !o.props.hidden ? i : -1))
    .filter((i) => i >= 0);
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(index),
    [position, setPosition] = useState({}),
    [host, setHost] = useState(null);
  const [name, setName] = useState(label || "اختيار");
  useLayoutEffect(() => {
    const labelNode = id
      ? document.querySelector('label[for="' + id + '"]')
      : null;
    setName(label || labelNode?.textContent?.trim() || "اختيار");
    setHost(trigger.current.closest("dialog") || document.body);
  }, [id, label]);
  useEffect(() => {
    if (!open) return;
    const outside = (e) => {
        if (
          !trigger.current?.contains(e.target) &&
          !list.current?.contains(e.target)
        )
          setOpen(false);
      },
      close = () => setOpen(false),
      scroll = (e) => {
        if (!list.current?.contains(e.target)) close();
      };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", close);
    const dialog = trigger.current.closest("dialog");
    dialog?.addEventListener("close", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", close);
      dialog?.removeEventListener("close", close);
    };
  }, [open]);
  useLayoutEffect(() => {
    if (open && list.current) {
      if (list.current.hasAttribute("popover") && list.current.showPopover) {
        list.current.showPopover();
      }
      list.current.children[active]?.scrollIntoView({ block: "nearest" });
    }
    return () => {
      if (list.current?.matches(":popover-open")) list.current.hidePopover();
    };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    if (disabled || trigger.current.closest("[inert]")) return;
    document.dispatchEvent(new CustomEvent("jadwa-close-selects"));
    const b = trigger.current.getBoundingClientRect(),
      width = Math.min(Math.max(b.width, 224), innerWidth - 24),
      below = innerHeight - b.bottom - 16,
      above = b.top - 16,
      up = below < 200 && above > below;
    setPosition({
      width,
      left: Math.max(12, Math.min(b.right - width, innerWidth - width - 12)),
      maxHeight: Math.max(60, Math.min(300, up ? above : below)),
      top: up ? "auto" : b.bottom + 7,
      bottom: up ? innerHeight - b.top + 7 : "auto",
      transformOrigin: up ? "bottom right" : "top right",
    });
    setActive(enabled.includes(index) ? index : (enabled[0] ?? -1));
    setOpen(true);
  }
  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener("jadwa-close-selects", close);
    return () => document.removeEventListener("jadwa-close-selects", close);
  }, []);
  function choose(i) {
    if (!enabled.includes(i)) return;
    setOpen(false);
    search.current = "";
    trigger.current.focus({ preventScroll: true });
    if (i !== index)
      onChange?.({ target: { value: String(options[i].props.value) } });
  }
  function key(e) {
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      if (!open) toggle();
      else {
        const n =
          e.key === "Home"
            ? enabled[0]
            : e.key === "End"
              ? enabled.at(-1)
              : enabled[
                  Math.max(
                    0,
                    Math.min(
                      enabled.length - 1,
                      enabled.indexOf(active) +
                        (e.key === "ArrowDown" ? 1 : -1),
                    ),
                  )
                ];
        setActive(n ?? -1);
        list.current?.children[n]?.scrollIntoView({ block: "nearest" });
      }
    } else if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      open ? choose(active) : toggle();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (!open) toggle();
      clearTimeout(timer.current);
      search.current += e.key;
      const i = enabled.find((i) =>
        String(options[i].props.children)
          .trim()
          .toLocaleLowerCase()
          .startsWith(search.current.toLocaleLowerCase()),
      );
      if (i !== undefined) setActive(i);
      timer.current = setTimeout(() => (search.current = ""), 700);
    }
  }
  return (
    <>
      <button
        {...props}
        type="button"
        ref={trigger}
        id={id}
        hidden={hidden}
        className="jd-select"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={id + "-listbox"}
        aria-expanded={open}
        aria-label={name + ": " + (options[index]?.props.children || "اختيار")}
        aria-activedescendant={open ? id + "-option-" + active : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={key}
      >
        <span className="jd-select-value">
          {options[index]?.props.children || "اختيار"}
        </span>
        <svg className="jd-select-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {open &&
        host &&
        createPortal(
          <div
            id={id + "-listbox"}
            ref={list}
            className="jd-select-menu"
            role="listbox"
            aria-label={name}
            dir="rtl"
            popover={host.tagName === "DIALOG" ? "manual" : undefined}
            style={position}
            onPointerDown={(e) => e.preventDefault()}
          >
            {options.map((o, i) => (
              <div
                key={String(o.props.value)}
                id={id + "-option-" + i}
                className={
                  "jd-select-option" + (i === active ? " is-active" : "")
                }
                role="option"
                hidden={o.props.hidden}
                aria-disabled={Boolean(o.props.disabled)}
                aria-selected={i === index}
                onPointerMove={() => enabled.includes(i) && setActive(i)}
                onClick={() => choose(i)}
              >
                <span>{o.props.children}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>
            ))}
          </div>,
          host,
        )}
    </>
  );
});
export default Select;
