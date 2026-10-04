export async function GET() {
  const backend = process.env.BACKEND_API_URL;
  if (!backend) {
    return Response.json({ success: false, message: "Marketplace is temporarily unavailable." }, { status: 503 });
  }
  try {
    const response = await fetch(`${backend.replace(/\/$/, "")}/landing/catalogue`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true || !Array.isArray(result.data?.listings) || !Array.isArray(result.data?.suppliers)) {
      throw new Error("Invalid catalogue response");
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, message: "We could not load the marketplace. Please try again." }, { status: 502 });
  }
}
