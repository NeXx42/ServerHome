import { Config } from "@/app/shared/config";
import { readConfig, saveConfig } from "@/app/shared/serverHelperFunctions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const config: Config = readConfig();
        const body: {
            id: number,
            config: any
        } = await req.json();

        config.modules![body.id] = body.config;
        saveConfig(config);

        return NextResponse.json({ msg: "Saved links" });
    }
    catch {
        return NextResponse.json({ err: "Failed to save links" }, { status: 500 })
    }
}