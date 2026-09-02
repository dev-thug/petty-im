import Image from "next/image";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/ui/wordmark";
import {
  HERO_BACKGROUND,
  HERO_DESCRIPTION,
  HERO_HEADLINE_PREFIX,
  HERO_HEADLINE_SUFFIX,
} from "@/content/landing-content";

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <Image
        alt=""
        className="z-0 object-cover object-center"
        fill
        preload
        sizes="100vw"
        src={HERO_BACKGROUND}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-background-deep/50"
      />

      <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-between gap-8 px-page py-24">
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-col gap-1 text-display font-bold text-foreground">
            <span>{HERO_HEADLINE_PREFIX}</span>
            <span className="flex items-center gap-2">
              <Wordmark size="display" />
              <span>{HERO_HEADLINE_SUFFIX}</span>
            </span>
          </h1>

          <p className="flex flex-col text-body text-text-secondary">
            {HERO_DESCRIPTION.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </section>
  );
}
