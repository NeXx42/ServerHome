export const runtime = "nodejs";

import path from "path";
import fs from "fs";
import { Config } from "./config";

export function readConfig() {
    const filePath = path.join(process.cwd(), "config/config.json");
    const raw = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(raw);
}

export function saveConfig(config: Config) {
    const filePath = path.join(process.cwd(), "config/config.json");
    fs.writeFileSync(filePath, JSON.stringify(config, null, 4));
}