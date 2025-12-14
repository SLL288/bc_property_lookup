import { NextResponse } from "next/server";

const allowedHosts = [
  "cosmos.surrey.ca",
  "gisservices.surrey.ca",
  "geodata.coquitlam.ca",
  "citymap.portcoquitlam.ca",
  "gis.burnaby.ca",
  "delivery.maps.gov.bc.ca"
];

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!allowedHosts.includes(parsed.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
    }

    // Rebuild URL with original query params (excluding url param itself)
    const forwardParams = new URLSearchParams(searchParams);
    forwardParams.delete("url");
    parsed.search = forwardParams.toString();

    const res = await fetch(parsed.toString());
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" }
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy fetch failed" },
      { status: 500 }
    );
  }
}
