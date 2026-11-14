"use client";

import { useEffect } from "react";

export const NEED_EVENT = "dorza:need";

export interface NeedEventDetail {
  option: string;
  message: string;
}

/**
 * Two small extras on top of the CSS picker. Neither is needed for it to work.
 * 1. A link to /#need-store (from an ad or another page) opens on that answer.
 * 2. "Get a quote" inside an answer carries the choice into the quote form below.
 */
export function NeedPickerEnhance() {
  useEffect(() => {
    function selectFromHash() {
      const slug = window.location.hash.match(/^#need-([a-z-]+)$/)?.[1];
      const input = slug ? document.getElementById(`need-${slug}`) : null;
      if (input instanceof HTMLInputElement && input.type === "radio") input.checked = true;
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

    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    document.addEventListener("click", carryChoice);
    return () => {
      window.removeEventListener("hashchange", selectFromHash);
      document.removeEventListener("click", carryChoice);
    };
  }, []);

  return null;
}
