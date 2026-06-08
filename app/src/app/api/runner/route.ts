import fs from "fs";

import { execFile } from "child_process";
import { readConfig } from "@/app/shared/serverHelperFunctions";
import { Config } from "@/app/shared/config";

const BASE_DIR = "/mnt/scripts";

export async function POST(req: Request) {
    const { scriptName, curlName } = await req.json();

    if (curlName) {
        try {
            const config: Config = readConfig();

            const res = await fetch(`${config.webhookConsumerUrl!}/run/${curlName}`, {
                method: "POST",
            });

            const data = await res.json();

            return Response.json({
                stdout: data.stdout,
                stderr: data.stderr,
                exit_code: data.exit_code,
            });
        } catch (e: any) {
            return Response.json(
                { error: e.message },
                { status: 500 }
            );
        }
    }
    else if (scriptName) {
        const scripts = fs.readdirSync(BASE_DIR).filter((file) => file.endsWith(".sh"));

        if (scripts.indexOf(`${scriptName}.sh`) === -1)
            return (Response.json({ error: "Script not found" }, { status: 500 }));

        return await new Promise<Response>((resolve) => {
            execFile("sh", [`${BASE_DIR}/${scriptName}.sh`], { cwd: BASE_DIR }, (err, stdout, stderr) => {
                if (err) {
                    resolve(Response.json({ error: err.message }, { status: 500 }));
                    return;
                }

                resolve(Response.json({ stdout, stderr }));
            });
        });
    }

    return Response.json({ error: "No script name or curl name was provided" }, { status: 500 });
}

export async function GET() {
    const scripts = fs.readdirSync(BASE_DIR).filter((file) => file.endsWith(".sh"));
    return Response.json(scripts);
}