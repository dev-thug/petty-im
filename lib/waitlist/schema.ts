import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const waitlistRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, { message: "invalid-email" })
    .refine((value) => EMAIL_PATTERN.test(value), {
      message: "invalid-email",
    }),
  consent: z.literal(true),
  honeypot: z.string().optional().default(""),
});

export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>;
