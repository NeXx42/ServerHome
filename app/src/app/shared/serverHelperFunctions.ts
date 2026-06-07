export const runtime = "nodejs";

import path from "path";
import fs from "fs";

export function readConfig() {
    const filePath = path.join(process.cwd(), "config/config.json");
    const raw = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(raw);
}
