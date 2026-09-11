"use client";
import { PETTY_APP_URL } from "@/content/app-links";
import {
  useLandingContent,
  LanguageSelector,
} from "@/components/landing/LocaleProvider";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/wordmark";
import { trackingAttributes } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

import { cn } from "@/lib/utils";
export function Header() {
  const { NAV_CTA_LABEL, NAV_LINKS, UI } = useLandingContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn("landing-header", (scrolled || open) && "is-scrolled")}
    >
      <div className="header-inner">
        <a
          aria-label="Petty"
          href="#hero"
          onClick={() => setOpen(false)}
          {...trackingAttributes("navigation_click", {
            nav_location: "header",
            nav_item: "logo",
          })}
        >
          <Wordmark className="header-logo" />
        </a>
        <nav
          aria-label={UI.navigation}
          id="landing-navigation"
          className={cn("header-nav", open && "is-open")}
        >
          {NAV_LINKS.map((link) => (
            <a
              href={link.href}
              key={link.id}
              onClick={() => setOpen(false)}
              {...trackingAttributes("navigation_click", {
                nav_location: "header",
                nav_item: link.id,
              })}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="header-cta"
          href={PETTY_APP_URL}
          onClick={() => setOpen(false)}
          {...trackingAttributes("open_app_click", { cta_location: "header" })}
        >
          {NAV_CTA_LABEL}
        </a>
        <LanguageSelector />
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="landing-navigation"
          aria-label={open ? UI.menuClose : UI.menuOpen}
          onClick={() => {
            track("menu_toggle", { menu_state: open ? "close" : "open" });
            setOpen(!open);
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
