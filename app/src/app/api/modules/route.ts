import { Config, Config_Module } from "@/app/shared/config";
import { readConfig, saveConfig } from "@/app/shared/serverHelperFunctions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const config: Config = readConfig();
        const modules: Config_Module[] = await req.json();

        config.modules = modules;
        saveConfig(config);

        return NextResponse.json({ msg: "Saved links" });
    }
    catch {
        return NextResponse.json({ err: "Failed to save links" }, { status: 500 })
    }
}