"use client";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import {
  trackingAttributes,
  type AnalyticsEvents,
} from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
export type StoreBadgeProps = {
  store: "appStore" | "googlePlay";
  eyebrow: string;
  label: string;
  href: string;
  trackingLocation: AnalyticsEvents["store_badge_click"]["cta_location"];
  className?: string;
};
export function StoreBadge({
  store,
  eyebrow,
  label,
  href,
  trackingLocation,
  className,
}: StoreBadgeProps) {
  if (!href.startsWith("https://")) return null;
  const Icon = store === "appStore" ? FaApple : FaGooglePlay;
  return (
    <a
      className={cn("store-badge", className)}
      href={href}
      {...trackingAttributes("store_badge_click", {
        store: store === "appStore" ? "app_store" : "google_play",
        cta_location: trackingLocation,
      })}
    >
      <Icon
        aria-hidden="true"
        className={
          store === "googlePlay" ? "store-icon google-play" : "store-icon"
        }
      />
      <span>
        <small>{eyebrow}</small>
        <strong>{label}</strong>
      </span>
    </a>
  );
}
