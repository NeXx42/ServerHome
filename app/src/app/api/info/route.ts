import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    let targetUrl = searchParams.get("url");

    if (!targetUrl) {
        return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    if (targetUrl.endsWith("/"))
        targetUrl = targetUrl.substring(0, targetUrl.length - 1);

    const res = await fetch(`${targetUrl}/api/4/all`);

    const data = await res.text();
    return new NextResponse(data);
}