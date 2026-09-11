"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { eventFromDataset, SECTION_ATTRIBUTE } from "@/lib/analytics/events";
import { sendEvent, track } from "@/lib/analytics/track";

/**
 * Delegated click tracking for every `data-ga-event` element, so server
 * components get tracking from plain attributes. Also reports each
 * `data-ga-section` the first time it reaches the middle of the viewport.
 */
export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Middle-click opens the link in a new tab without firing `click`.
      if (event.type === "auxclick" && event.button !== 1) return;
      const element = (event.target as Element | null)?.closest?.(
        "[data-ga-event]",
      );
      if (!element) return;
      const parsed = eventFromDataset((element as HTMLElement).dataset);
      if (parsed) sendEvent(parsed.name, parsed.params);
    };
    // Capture phase, so the hit is queued before any handler navigates away.
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const id = entry.target.getAttribute(SECTION_ATTRIBUTE);
          if (!id || seen.has(id)) continue;
          seen.add(id);
          track("section_view", { section_id: id });
        }
      },
      // A thin band across the middle of the viewport, so sections taller than
      // the screen still count once they are actually being read.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    document
      .querySelectorAll(`[${SECTION_ATTRIBUTE}]`)
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
