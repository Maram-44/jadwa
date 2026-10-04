import { useLayoutEffect, useRef } from "react";
export function useLandingMotion(refs) {
  const shouldIntro = useRef(null);
  if (shouldIntro.current === null) {
    try {
      shouldIntro.current =
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !sessionStorage.getItem("jadwa-intro-v1") &&
        !location.hash;
    } catch {
      shouldIntro.current = false;
    }
  }
  useLayoutEffect(() => {
    const root = document.documentElement,
      intro = refs.intro.current,
      logo = refs.logo.current,
      navLogo = refs.navLogo.current,
      reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      surfaces = [
        refs.header.current,
        refs.main.current,
        refs.footer.current,
      ].filter(Boolean),
      animations = [],
      timers = [];
    let finished = false,
      observer;
    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      animations.forEach((a) => a.cancel());
      root.classList.remove("intro-active", "page-enter");
      surfaces.forEach((el) => (el.inert = false));
      intro.hidden = true;
      if (intro.contains(document.activeElement))
        refs.main.current
          ?.querySelector(".hero-actions a")
          ?.focus({ preventScroll: true });
    }
    function key(e) {
      if (e.key === "Escape") finish();
    }
    if (shouldIntro.current && !reduced.matches && logo.animate) {
      try {
        intro.hidden = false;
        root.classList.add("intro-active");
        surfaces.forEach((el) => (el.inert = true));
        logo.style.cssText = "";
        const rect = logo.getBoundingClientRect(),
          target = navLogo.getBoundingClientRect();
        logo.style.left = rect.left + "px";
        logo.style.top = rect.top + "px";
        logo.style.width = rect.width + "px";
        logo.style.transform = "none";
        intro.querySelectorAll(".intro-piece").forEach((piece, i) =>
          animations.push(
            piece.animate(
              [
                {
                  opacity: 0,
                  transform: `translate(${45 + i * 25}px, ${-75 + i * 65}px)`,
                },
                { opacity: 1, transform: "translate(0, 0)" },
              ],
              {
                duration: 560,
                delay: i * 130,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "both",
              },
            ),
          ),
        );
        animations.push(
          intro.querySelector(".intro-word").animate(
            [
              { opacity: 0, transform: "translateX(35px)" },
              { opacity: 1, transform: "translateX(0)" },
            ],
            { duration: 460, delay: 350, fill: "both", easing: "ease-out" },
          ),
        );
        animations.push(
          logo.animate(
            [
              { transform: "translate(0, 0) scale(1)" },
              {
                transform: `translate(${target.left - rect.left}px, ${target.top - rect.top}px) scale(${target.width / rect.width})`,
              },
            ],
            {
              duration: 760,
              delay: 950,
              fill: "forwards",
              easing: "cubic-bezier(.65,0,.25,1)",
            },
          ),
        );
        animations.push(
          intro
            .querySelector(".intro-veil")
            .animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 650,
              delay: 950,
              fill: "forwards",
              easing: "ease-out",
            }),
        );
        timers.push(
          setTimeout(() => {
            try {
              sessionStorage.setItem("jadwa-intro-v1", "1");
            } catch {}
          }, 0),
        );
        timers.push(
          setTimeout(() => root.classList.add("page-enter"), 950),
          setTimeout(finish, 1900),
          setTimeout(finish, 3000),
        );
      } catch {
        finish();
      }
    } else finish();
    refs.skip.current?.addEventListener("click", finish);
    window.addEventListener("resize", finish);
    document.addEventListener("keydown", key);
    const main = refs.main.current;
    main
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.remove("reveal"));
    const groups = [
        ".audience-line > span",
        "#how .section-heading > *",
        "#how .step",
        "#opportunities .section-heading > *",
        ".opportunity-tabs > button",
        "#op-panel",
        "#explore .section-heading > *",
        ".explore-tabs",
        "#explore-panel",
        ".advisor-copy > *",
        ".advisor-preview",
        ".closing > *",
        ".faq > div:first-child > *",
        ".faq-list > details",
      ],
      reveals = [];
    groups.forEach((selector) =>
      main.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-delay", Math.min(i * 90, 270) + "ms");
        reveals.push(el);
      }),
    );
    function reveal(el, immediate = false) {
      if (immediate) el.style.setProperty("--reveal-delay", "0ms");
      el.classList.add("is-visible");
      observer?.unobserve(el);
    }
    if (!reduced.matches && "IntersectionObserver" in window) {
      try {
        observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) reveal(e.target);
            }),
          { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
        );
        reveals.forEach((el) => observer.observe(el));
        root.classList.add("motion-ready");
      } catch {
        observer?.disconnect();
        root.classList.remove("motion-ready");
      }
    }
    function focus(e) {
      const el = e.target.closest(".reveal");
      if (el) reveal(el, true);
    }
    function change(e) {
      if (!e.matches) return;
      finish();
      observer?.disconnect();
      root.classList.remove("motion-ready");
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
    document.addEventListener("focusin", focus);
    reduced.addEventListener("change", change);
    return () => {
      timers.forEach(clearTimeout);
      animations.forEach((a) => a.cancel());
      observer?.disconnect();
      root.classList.remove("intro-active", "page-enter", "motion-ready");
      surfaces.forEach((el) => (el.inert = false));
      reveals.forEach((el) => el.classList.remove("reveal", "is-visible"));
      refs.skip.current?.removeEventListener("click", finish);
      window.removeEventListener("resize", finish);
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", focus);
      reduced.removeEventListener("change", change);
    };
  }, []);
}
export function usePanelMotion(ref, key) {
  useLayoutEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !ref.current?.animate
    )
      return;
    const a = ref.current.animate(
      [
        { opacity: 0.55, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 240, easing: "ease-out" },
    );
    return () => a.cancel();
  }, [key]);
}
