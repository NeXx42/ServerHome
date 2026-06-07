import { readConfig, saveConfig } from "@/app/shared/serverHelperFunctions";
import { Config, Config_Links } from "@/app/shared/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const config: Config = readConfig();
    const body: Config_Links[] = await req.json();

    try {
        saveConfig({
            ...config,
            links: body
        });

        return NextResponse.json({ msg: "Saved links" });
    }
    catch {
        return NextResponse.json({ err: "Failed to save links" }, { status: 500 })
    }
}