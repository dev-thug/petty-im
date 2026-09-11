import { buildRss } from "@/lib/seo/rss";

// Built once per deploy: the feed only changes when the comparison content does.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildRss(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
