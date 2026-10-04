export async function GET() {
  const backend = process.env.BACKEND_API_URL;
  if (!backend) return Response.json({ success: false }, { status: 503 });
  try {
    const response = await fetch(`${backend.replace(/\/$/, "")}/subscription?isActive=true`, {
      cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !Array.isArray(result.data)) throw new Error("Invalid plans");
    const plans = result.data.filter((plan: Record<string, unknown>) => plan.isActive === true &&
      typeof plan.planName === "string" && typeof plan.pricePerMonth === "number" &&
      Number.isFinite(plan.pricePerMonth) && plan.pricePerMonth >= 0 &&
      typeof plan.pricePerYear === "number" && Number.isFinite(plan.pricePerYear) && plan.pricePerYear >= 0)
      .slice(0, 6).map((plan: Record<string, unknown>) => ({
        id: String(plan._id), name: plan.planName, description: typeof plan.description === "string" ? plan.description : "",
        monthly: plan.pricePerMonth, yearly: plan.pricePerYear,
        features: Array.isArray(plan.features) ? plan.features.filter((feature) => typeof feature === "string").slice(0, 12) : [],
      }));
    // Subscription checkout currently charges USD in the backend payment controller.
    return Response.json({ success: true, data: plans, currency: "USD" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, message: "Seller plans are temporarily unavailable." }, { status: 502 });
  }
}
