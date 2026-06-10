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

export function getSession(id: string): Config | undefined {
    const time = Date.now();

    global.sessions ??= [];
    global.sessions = global.sessions.filter(s => time - s.keepAlive <= 60_000);

    const index = global.sessions.findIndex(s => s.id === id);

    if (index === -1)
        return undefined;

    global.sessions[index].keepAlive = time;
    return global.sessions[index].config;
}