"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

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
import { cn } from "@/lib/utils";
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
  const statusId = useId();
  const statusRef = useRef<HTMLParagraphElement>(null);

  const isPending = status.kind === "pending";
  const isSuccess = status.kind === "success";
  const isError = status.kind === "error";

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") {
      statusRef.current?.focus();
    }
  }, [status.kind]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending || isSuccess) {
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

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={emailId}>{WAITLIST_EMAIL_LABEL}</Label>
        <Input
          aria-describedby={isError ? statusId : undefined}
          aria-invalid={isError ? true : undefined}
          autoComplete="email"
          disabled={isPending || isSuccess}
          id={emailId}
          name="email"
          placeholder={WAITLIST_EMAIL_PLACEHOLDER}
          required
          type="email"
        />
      </div>

      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        type="text"
      />

      <div className="flex items-start gap-2">
        <Checkbox
          checked={consent}
          disabled={isPending || isSuccess}
          id={consentId}
          onCheckedChange={(value) => setConsent(value === true)}
          required
        />
        <Label className="text-body-sm text-text-secondary" htmlFor={consentId}>
          {WAITLIST_CONSENT_LABEL}
        </Label>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "min-h-11 text-body-sm",
          isError && "text-error",
          isSuccess && "text-success",
        )}
        id={statusId}
        ref={statusRef}
        role="status"
        tabIndex={-1}
      >
        {isError
          ? WAITLIST_ERROR_MESSAGES[status.code]
          : isSuccess
            ? WAITLIST_SUCCESS_MESSAGE
            : null}
      </p>

      <Button
        className="w-full"
        disabled={isPending || status.kind === "success" || !consent}
        type="submit"
      >
        {isPending ? WAITLIST_SUBMIT_PENDING_LABEL : WAITLIST_SUBMIT_LABEL}
      </Button>
    </form>
  );
}
