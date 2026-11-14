"use client";

import { useEffect } from "react";

export const NEED_EVENT = "dorza:need";

export interface NeedEventDetail {
  option: string;
  message: string;
}

/** How long each need shows during the tour. */
export const TOUR_MS = 6000;

/**
 * Extras on top of the CSS picker. None is needed for it to work.
 * 1. A link to /#need-store (from an ad or another page) opens on that answer.
 * 2. "Get a quote" inside an answer carries the choice into the quote form below.
 * 3. The tour: the picker steps through every need on its own until the visitor
 *    picks one. It pauses off screen and in a hidden tab, has a pause button, and
 *    never starts for reduced motion or a deep link.
 */
export function NeedPickerEnhance() {
  useEffect(() => {
    function selectFromHash() {
      const slug = window.location.hash.match(/^#need-([a-z-]+)$/)?.[1];
      const input = slug ? document.getElementById(`need-${slug}`) : null;
      if (input instanceof HTMLInputElement && input.type === "radio") {
        input.checked = true;
        return true;
      }
      return false;
    }

    function carryChoice(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-need-quote]");
      if (!link) return;
      const detail: NeedEventDetail = {
        option: link.dataset.needOption ?? "",
        message: link.dataset.needMessage ?? "",
      };
      window.dispatchEvent(new CustomEvent<NeedEventDetail>(NEED_EVENT, { detail }));
    }

    const deepLinked = selectFromHash();
    const onHash = () => {
      if (selectFromHash()) tour?.stop();
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", carryChoice);

    const tour = deepLinked ? null : startTour();
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", carryChoice);
      tour?.destroy();
    };
  }, []);

  return null;
}

function startTour() {
  const picker = document.querySelector<HTMLElement>(".need-picker");
  const toggle = picker?.querySelector<HTMLButtonElement>("[data-tour-toggle]");
  const scroller = picker?.querySelector<HTMLElement>(".need-options");
  if (!picker || !toggle || !scroller) return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const radios = Array.from(picker.querySelectorAll<HTMLInputElement>('input[name="need"]'));
  let timer: number | undefined;
  let paused = false; // by the button
  let stopped = false; // by the visitor picking a need
  let onScreen = true;

  picker.style.setProperty("--tour-ms", `${TOUR_MS}ms`);
  toggle.hidden = false;

  function render() {
    const running = !stopped && !paused && onScreen && !document.hidden;
    picker!.dataset.tour = running ? "on" : "off";
    toggle!.hidden = stopped;
    toggle!.textContent = paused ? "Play tour" : "Pause tour";
    toggle!.setAttribute("aria-pressed", String(paused));
    return running;
  }

  function schedule() {
    window.clearTimeout(timer);
    if (render()) timer = window.setTimeout(advance, TOUR_MS);
  }

  function advance() {
    const i = radios.findIndex((r) => r.checked);
    const next = radios[(i + 1) % radios.length];
    next.checked = true;
    // On a phone the choices scroll sideways: keep the current one in view without moving the page.
    if (scroller!.scrollWidth > scroller!.clientWidth) {
      const label = next.nextElementSibling as HTMLElement | null;
      if (label) scroller!.scrollTo({ left: Math.max(0, label.offsetLeft - 24), behavior: "smooth" });
    }
    schedule();
  }

  function stop() {
    stopped = true;
    schedule();
  }

  // Picking a need, by touch, mouse or keyboard, ends the tour for good.
  const onPick = (e: Event) => {
    if ((e.target as Element).matches('input[name="need"]') && e.isTrusted) stop();
  };
  const onToggle = () => {
    paused = !paused;
    schedule();
  };
  const onVisibility = () => schedule();
  const observer = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    },
    { threshold: 0.35 }
  );

  picker.addEventListener("change", onPick);
  toggle.addEventListener("click", onToggle);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(picker);
  schedule();

  return {
    stop,
    destroy() {
      window.clearTimeout(timer);
      observer.disconnect();
      picker.removeEventListener("change", onPick);
      toggle.removeEventListener("click", onToggle);
      document.removeEventListener("visibilitychange", onVisibility);
      delete picker.dataset.tour;
    },
  };
}
