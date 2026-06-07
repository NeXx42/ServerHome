import fs from "fs";
import { execFile } from "child_process";

const BASE_DIR = "/mnt/scripts";

export async function POST(req: Request) {
    const { scriptName } = await req.json();
    const scripts = fs.readdirSync(BASE_DIR).filter((file) => file.endsWith(".sh"));

    if (scripts.indexOf(`${scriptName}.sh`) === -1)
        return (Response.json({ error: "Script not found" }, { status: 500 }));

    return new Promise((resolve) => {
        execFile("sh", [`${BASE_DIR}/${scriptName}.sh`], { cwd: BASE_DIR }, (err, stdout, stderr) => {
            if (err) {
                resolve(Response.json({ error: err.message }, { status: 500 }));
                return;
            }

            resolve(Response.json({ stdout, stderr }));
        });
    });
}

export async function GET() {
    const scripts = fs.readdirSync(BASE_DIR).filter((file) => file.endsWith(".sh"));
    return Response.json(scripts);
}