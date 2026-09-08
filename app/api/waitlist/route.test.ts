import { expect, it } from "vitest";
import { POST } from "./route";
it("does not accept or store new registrations after retirement", async () => {
  const response = await POST(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", consent: true }),
    }),
  );
  expect(response.status).toBe(410);
  expect(await response.json()).toEqual({ error: "service-retired" });
});
