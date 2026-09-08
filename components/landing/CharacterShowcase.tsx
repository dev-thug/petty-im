"use client";
import { PETTY_APP_URL } from "@/content/app-links";
import { useLandingContent } from "@/components/landing/LocaleProvider";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Dialog } from "radix-ui";

export function CharacterShowcase() {
  const {
    CHARACTERS,
    CHARACTERS_MORE_LABEL,
    CHARACTERS_SUBTITLE,
    CHARACTERS_TITLE,
    UI,
    INTRODUCTIONS,
  } = useLandingContent();
  return (
    <section className="landing-characters landing-container" id="characters">
      <div className="section-heading">
        <h2>{CHARACTERS_TITLE}</h2>
        <p>{CHARACTERS_SUBTITLE}</p>
      </div>
      <ul className="character-grid">
        {CHARACTERS.map((character) => (
          <li key={character.id}>
            <Dialog.Root>
              <Dialog.Trigger
                className="character-card"
                aria-label={`${character.name} — ${UI.characterDetails}`}
              >
                <Image
                  fill
                  sizes="(max-width: 600px) 45vw, 180px"
                  src={`/assets/${character.id}.webp`}
                  alt={`${character.role}, ${character.name}`}
                />
                <div className="character-caption">
                  <strong>
                    {character.role}, {character.name}
                  </strong>
                  <span>{character.genre}</span>
                </div>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="landing-dialog-overlay" />
                <Dialog.Content className="landing-dialog">
                  <Image
                    className="dialog-portrait"
                    src={`/assets/${character.id}.webp`}
                    width={180}
                    height={220}
                    alt={character.name}
                  />
                  <Dialog.Title>
                    {character.role}, {character.name}
                  </Dialog.Title>
                  <Dialog.Description>
                    {INTRODUCTIONS[character.id]}
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <a className="landing-button" href={PETTY_APP_URL}>
                      {UI.storyCta}
                    </a>
                  </Dialog.Close>
                  <Dialog.Close className="dialog-close" aria-label={UI.close}>
                    {UI.close}
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </li>
        ))}
        <li>
          <a className="more-characters" href={PETTY_APP_URL}>
            <Plus size={34} strokeWidth={1.2} aria-hidden="true" />
            <span>
              {CHARACTERS_MORE_LABEL.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
