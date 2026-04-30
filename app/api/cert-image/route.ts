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
      `https://djsceisaca.tech/api/cert-image?code=${encodeURIComponent(code)}&format=${format || "png"}`,
      { cache: "no-store" }
    );

    const buffer = await upstream.arrayBuffer();

    

    return new NextResponse(buffer, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",

        "Content-Disposition":
          upstream.headers.get("content-disposition") ||
          (format === "pdf"
            ? `attachment; filename="certificate-${code}.pdf"`
            : `inline`),

        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Proxy failed", { status: 500 });
  }
}