"use client";
import { PETTY_APP_URL } from "@/content/app-links";
import { useLandingContent } from "@/components/landing/LocaleProvider";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { StoreBadge } from "@/components/ui/store-badge";

function createStarField(count: number, seed: number) {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return Array.from({ length: count }, () => {
    const left = next() * 100;
    const top = next() * (left > 45 ? 35 : 60);
    const glow = next() < 0.15;

    return {
      left,
      top,
      glow,
      size: glow ? 2 + next() * 1.5 : 1 + next(),
      duration: 2 + next() * 3,
      delay: next() * 4,
    };
  });
}

const HERO_STARS = createStarField(42, 7);

export function Hero() {
  const {
    HERO_BACKGROUND,
    HERO_DESCRIPTION,
    HERO_PRIMARY_CTA_LABEL,
    HERO_SECONDARY_CTA_LABEL,
    HERO_TITLE_HIGHLIGHT,
    HERO_TITLE_LINES,
    STORE_BADGES,
  } = useLandingContent();
  return (
    <section className="landing-hero" id="hero">
      <div className="hero-art-frame" aria-hidden="true">
        <Image
          alt=""
          className="hero-art"
          fill
          preload
          sizes="(min-width: 1280px) 1280px, 100vw"
          src={HERO_BACKGROUND}
        />
        <div className="hero-starfield" aria-hidden="true">
          {HERO_STARS.map((star, index) => (
            <span
              key={index}
              className="hero-star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                boxShadow: star.glow
                  ? `0 0 ${star.size * 3}px rgba(255,255,255,0.9)`
                  : undefined,
                animation: `hero-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="hero-copy">
        <h1>
          {HERO_TITLE_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="hero-highlight">{HERO_TITLE_HIGHLIGHT}</span>
          <Heart className="hero-heart" aria-hidden="true" strokeWidth={1.3} />
        </h1>
        <p>
          {HERO_DESCRIPTION.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div className="hero-actions">
          <a className="landing-button" href={PETTY_APP_URL}>
            {HERO_PRIMARY_CTA_LABEL}
          </a>
          <a className="landing-button secondary" href="#characters">
            <ArrowUpRight size={18} aria-hidden="true" />
            {HERO_SECONDARY_CTA_LABEL}
          </a>
        </div>
        <div className="store-row hero-stores">
          <StoreBadge store="appStore" {...STORE_BADGES.appStore} />
          <StoreBadge store="googlePlay" {...STORE_BADGES.googlePlay} />
        </div>
      </div>
    </section>
  );
}
