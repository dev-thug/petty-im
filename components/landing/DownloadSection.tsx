"use client";
import { PETTY_APP_URL } from "@/content/app-links";
import { useLandingContent } from "@/components/landing/LocaleProvider";
import Image from "next/image";
import { StoreBadge } from "@/components/ui/store-badge";
import { sectionAttributes, trackingAttributes } from "@/lib/analytics/events";

export function DownloadSection() {
  const { DOWNLOAD_SUBTITLE, DOWNLOAD_TITLE, STORE_BADGES, UI, PHONE_IMAGE } =
    useLandingContent();
  return (
    <section
      className="landing-download"
      id="download"
      {...sectionAttributes("download")}
    >
      <div className="download-inner">
        <div className="phone-art">
          <Image
            src={PHONE_IMAGE}
            alt={UI.phoneAlt}
            width={1536}
            height={1024}
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </div>
        <div className="download-copy">
          <h2>{DOWNLOAD_TITLE}</h2>
          <p>{DOWNLOAD_SUBTITLE}</p>
          <div className="store-row">
            <a
              className="landing-button"
              href={PETTY_APP_URL}
              {...trackingAttributes("open_app_click", {
                cta_location: "download",
              })}
            >
              {UI.openApp}
            </a>
            <StoreBadge
              store="appStore"
              trackingLocation="download"
              {...STORE_BADGES.appStore}
            />
            <StoreBadge
              store="googlePlay"
              trackingLocation="download"
              {...STORE_BADGES.googlePlay}
            />
            <a
              className="download-qr"
              href={PETTY_APP_URL}
              aria-label={UI.qrLink}
              {...trackingAttributes("open_app_click", {
                cta_location: "download_qr",
              })}
            >
              <Image
                src="/assets/app-qr.png"
                width={84}
                height={84}
                alt={UI.qrAlt}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
