import { FOOTER_CONTACT_EMAIL, FOOTER_COPYRIGHT } from "@/content/landing-content";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-page py-8 text-center text-body-sm text-text-muted">
      <p>{FOOTER_COPYRIGHT}</p>
      <p>
        문의:{" "}
        <a className="underline" href={`mailto:${FOOTER_CONTACT_EMAIL}`}>
          {FOOTER_CONTACT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
