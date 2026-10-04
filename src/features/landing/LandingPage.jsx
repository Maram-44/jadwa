import { useState, useRef, useEffect } from "react";
import View from "./components/IndexView.jsx";
import { months, opportunities } from "../../shared/data/demo.js";
import { views } from "./model/views.js";
import { number, Money, Text } from "../../shared/ui/primitives.jsx";
import { useLandingMotion, usePanelMotion } from "./hooks/useLandingMotion.js";
export default function LandingPage() {
  const [op, setOp] = useState(0),
    [view, setView] = useState("products"),
    [menu, setMenu] = useState(false),
    [compact, setCompact] = useState(
      () => matchMedia("(max-width:760px)").matches,
    );
  const refs = {
      intro: useRef(),
      logo: useRef(),
      navLogo: useRef(),
      header: useRef(),
      main: useRef(),
      footer: useRef(),
      skip: useRef(),
    },
    menuButton = useRef(),
    opPanel = useRef(),
    explorePanel = useRef(),
    tabs = useRef({});
  useLandingMotion(refs);
  usePanelMotion(opPanel, op);
  usePanelMotion(explorePanel, view);
  useEffect(() => {
    const outside = (e) => {
        if (!refs.header.current?.contains(e.target)) setMenu(false);
      },
      key = (e) => {
        if (e.key === "Escape") {
          setMenu(false);
          if (menu) menuButton.current?.focus();
        }
      },
      media = matchMedia("(max-width:760px)"),
      mobile = matchMedia("(max-width:520px)"),
      resize = (e) => setCompact(e.matches),
      close = () => setMenu(false);
    document.addEventListener("click", outside);
    document.addEventListener("keydown", key);
    media.addEventListener("change", resize);
    mobile.addEventListener("change", close);
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", key);
      media.removeEventListener("change", resize);
      mobile.removeEventListener("change", close);
    };
  }, [menu]);
  function tabBindings(prefix, values, current, set, vertical = false) {
    return Object.fromEntries(
      values.map((v, index) => [
        prefix + v,
        {
          "aria-selected": v === current,
          tabIndex: v === current ? 0 : -1,
          onClick: () => set(v),
          onKeyDown: (e) => {
            let next;
            const forward = vertical ? "ArrowDown" : "ArrowLeft",
              back = vertical ? "ArrowUp" : "ArrowRight";
            if (e.key === forward) next = (index + 1) % values.length;
            if (e.key === back)
              next = (index - 1 + values.length) % values.length;
            if (e.key === "Home") next = 0;
            if (e.key === "End") next = values.length - 1;
            if (next !== undefined) {
              e.preventDefault();
              set(values[next]);
              tabs.current[prefix + values[next]]?.focus();
            }
          },
        },
      ]),
    );
  }
  const o = opportunities[op],
    v = views[view];
  const slots = {
    "op-category": o.category,
    "op-title": o.title,
    "op-evidence": o.evidence,
    "op-action": o.steps[0],
    "op-amount": <Money value={months.sep.amounts[op]} />,
    "op-calculation": <Text>{o.calculation}</Text>,
    "op-announcement":
      o.title + "، وفر محتمل " + number(months.sep.amounts[op]) + " ريال سعودي",
    "explore-question": v.question,
    "explore-description": v.description,
    "explore-footnote": v.footnote,
    "explore-caption": "عينة من " + v.label + " في سبتمبر ٢٠٢٦",
    "explore-link": "استكشف " + v.label,
    "explore-head": (
      <tr>
        {v.headings.map((h) => (
          <th key={h} scope="col">
            {h}
          </th>
        ))}
      </tr>
    ),
    "explore-body": v.rows().map((row, i) => (
      <tr key={i}>
        {row.map((value, j) => (
          <td key={j}>
            {typeof value === "object" ? (
              <span
                className={"table-status" + (value.caution ? " caution" : "")}
              >
                {value.text}
              </span>
            ) : (
              <Text>{value}</Text>
            )}
          </td>
        ))}
      </tr>
    )),
  };
  const tabRefs = {};
  [0, 1, 2].forEach(
    (i) =>
      (tabRefs["op-tab-" + i] = (el) => (tabs.current["data-op:" + i] = el)),
  );
  ["products", "inventory", "expenses"].forEach(
    (v) =>
      (tabRefs["explore-" + v] = (el) => (tabs.current["data-view:" + v] = el)),
  );
  return (
    <View
      slots={slots}
      refs={{
        ...tabRefs,
        "brand-intro": refs.intro,
        "intro-logo": refs.logo,
        "nav-logo": refs.navLogo,
        "site-header": refs.header,
        main: refs.main,
        footer: refs.footer,
        "skip-intro": refs.skip,
        "landing-menu": menuButton,
        "op-panel": opPanel,
        "explore-panel": explorePanel,
      }}
      bindings={{
        "landing-menu": {
          "aria-expanded": menu,
          onClick: () => setMenu(!menu),
        },
        "landing-nav": {
          className: menu ? "is-open" : "",
          onClick: (e) => {
            if (e.target.closest("a")) setMenu(false);
          },
        },
        ".opportunity-tabs": {
          "aria-orientation": compact ? "horizontal" : "vertical",
        },
        ...tabBindings("data-op:", [0, 1, 2], op, setOp, !compact),
        ...tabBindings(
          "data-view:",
          ["products", "inventory", "expenses"],
          view,
          setView,
        ),
        "op-panel": { "aria-labelledby": "op-tab-" + op },
        "explore-panel": { "aria-labelledby": "explore-" + view },
        "op-link": { href: "opportunities.html?month=sep&opportunity=" + op },
        "explore-link": { href: v.href },
      }}
    />
  );
}
