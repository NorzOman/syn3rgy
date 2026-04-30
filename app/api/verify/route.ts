import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://djsceisaca.tech/api/verify?code=${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}