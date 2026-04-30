import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[generate route]: Sending req to generate api and get code")
   
    const response = await fetch("https://djsceisaca.tech/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const text = await response.text();
    console.log("[generate route]: received text: ",text)

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);

      return NextResponse.json(
        {
          message: "Upstream server returned non-JSON response",
          raw: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}