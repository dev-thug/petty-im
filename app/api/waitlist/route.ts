/** Retired endpoint: never read the body or connect to the former signup database. */
export async function POST(request: Request): Promise<Response> {
  void request;
  return Response.json({ error: "service-retired" }, { status: 410 });
}
