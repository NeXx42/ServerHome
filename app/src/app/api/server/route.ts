import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch(
        "http://192.168.0.10:61208/api/4/all",
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.GLANCES_USER}:${process.env.GLANCES_PASSWORD}`
                    ).toString("base64"),
            },
            cache: "no-store",
        }
    );

    const data = await response.json();

    return NextResponse.json(data);
}