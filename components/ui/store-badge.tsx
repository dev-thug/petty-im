"use client";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { cn } from "@/lib/utils";
export type StoreBadgeProps = {
  store: "appStore" | "googlePlay";
  eyebrow: string;
  label: string;
  href: string;
  className?: string;
};
export function StoreBadge({
  store,
  eyebrow,
  label,
  href,
  className,
}: StoreBadgeProps) {
  if (!href.startsWith("https://")) return null;
  const Icon = store === "appStore" ? FaApple : FaGooglePlay;
  return (
    <a className={cn("store-badge", className)} href={href}>
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
