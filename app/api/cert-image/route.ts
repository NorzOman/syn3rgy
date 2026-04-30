import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const format = searchParams.get("format");

  if (!code) {
    return new NextResponse("Missing code", { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://djsceisaca.tech/api/cert-image?code=${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );

    // ❗ important: preserve content-type (image/png)
    const contentType = format === "pdf" ? "application/pdf" : upstream.headers.get("content-type") || "image/png";

    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        // optional but good:
        "Cache-Control": "public, max-age=3600",
        ...(format === "pdf" && {
          "Content-Disposition": `attachment; filename="certificate-${code}.pdf"`,
        }),
      },
    });
  } catch {
    return new NextResponse("Proxy failed", { status: 500 });
  }
}