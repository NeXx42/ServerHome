export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

import PageClient from "./pageClient";
import { Config } from "../shared/types";

export default async function () {
    const filePath = path.join(process.cwd(), "config/config.json");
    const raw = fs.readFileSync(filePath, "utf-8");

    const config: Config = JSON.parse(raw);
    return <PageClient config={config} />
}