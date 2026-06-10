import { Config } from "@/app/shared/config";
import { getSession } from "@/app/shared/serverHelperFunctions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (!sessionId)
        return NextResponse.json({ error: "Missing Session" }, { status: 401 });

    const sessionInfo = getSession(sessionId);

    if (sessionInfo === undefined)
        return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    let glancesUrl = sessionInfo.glancesUrl;

    if (glancesUrl.endsWith("/"))
        glancesUrl = glancesUrl.substring(0, glancesUrl.length - 1);

    const res = await fetch(`${glancesUrl}/api/4/all`);

    const data = await res.text();
    return new NextResponse(data);
}