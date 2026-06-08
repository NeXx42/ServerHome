import { readConfig, saveConfig } from "@/app/shared/serverHelperFunctions";
import { Config, Config_Actions } from "@/app/shared/config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const config: Config = readConfig();
    const body: Config_Actions[] = await req.json();

    try {
        saveConfig({
            ...config,
            actions: body
        });

        return NextResponse.json({ msg: "Saved links" });
    }
    catch {
        return NextResponse.json({ err: "Failed to save links" }, { status: 500 })
    }
}