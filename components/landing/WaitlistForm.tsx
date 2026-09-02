"use client";

import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WAITLIST_CONSENT_LABEL,
  WAITLIST_EMAIL_LABEL,
  WAITLIST_EMAIL_PLACEHOLDER,
  WAITLIST_ERROR_MESSAGES,
  WAITLIST_SUBMIT_LABEL,
  WAITLIST_SUBMIT_PENDING_LABEL,
  WAITLIST_SUCCESS_MESSAGE,
} from "@/content/landing-content";
import { toWaitlistErrorCode, type WaitlistErrorCode } from "@/lib/waitlist/error-code";

type WaitlistStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success" }
  | { kind: "error"; code: WaitlistErrorCode };

const HONEYPOT_FIELD_NAME = "company";

export function WaitlistForm() {
  const [status, setStatus] = useState<WaitlistStatus>({ kind: "idle" });
  const [consent, setConsent] = useState(false);
  const emailId = useId();
  const consentId = useId();

  const isPending = status.kind === "pending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const honeypot = String(formData.get(HONEYPOT_FIELD_NAME) ?? "");

    setStatus({ kind: "pending" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, honeypot }),
      });

      if (response.ok) {
        setStatus({ kind: "success" });
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      setStatus({ kind: "error", code: toWaitlistErrorCode(body?.error) });
    } catch {
      setStatus({ kind: "error", code: "network" });
    }
  }

  if (status.kind === "success") {
    return (
      <p className="min-h-11 text-body-sm text-success" role="status">
        {WAITLIST_SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={emailId}>{WAITLIST_EMAIL_LABEL}</Label>
        <Input
          autoComplete="email"
          disabled={isPending}
          id={emailId}
          name="email"
          placeholder={WAITLIST_EMAIL_PLACEHOLDER}
          required
          type="email"
        />
      </div>

      <input
        aria-hidden="true"
        className="hidden"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        type="text"
      />

      <div className="flex items-start gap-2">
        <Checkbox
          checked={consent}
          disabled={isPending}
          id={consentId}
          onCheckedChange={(value) => setConsent(value === true)}
          required
        />
        <Label className="text-body-sm text-text-secondary" htmlFor={consentId}>
          {WAITLIST_CONSENT_LABEL}
        </Label>
      </div>

      <p aria-live="polite" className="min-h-11 text-body-sm text-error">
        {status.kind === "error" ? WAITLIST_ERROR_MESSAGES[status.code] : null}
      </p>

      <Button className="w-full" disabled={isPending || !consent} type="submit">
        {isPending ? WAITLIST_SUBMIT_PENDING_LABEL : WAITLIST_SUBMIT_LABEL}
      </Button>
    </form>
  );
}
