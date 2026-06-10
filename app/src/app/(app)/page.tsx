export const dynamic = "force-dynamic";

import PageClient from "./pageClient";

import { readConfig } from "../shared/serverHelperFunctions";
import { randomUUID } from "crypto";
import { SessionInfo } from "../shared/session";
import { ClientConfig, Config } from "../shared/config";

declare global {
    var sessions: SessionInfo[] | undefined;
}

export default async function () {
    const config: Config = readConfig();
    const id = randomUUID();

    global.sessions ??= [];
    global.sessions.push({
        id: id,
        config: config,
        keepAlive: Date.now()
    })

    const clientConfig: ClientConfig = {
        title: config.title,
        webhookConsumerUrl: config.webhookConsumerUrl,

        modules: config.modules,
    }

    return <PageClient config={clientConfig} sessionId={id} />
}