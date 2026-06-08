export const dynamic = "force-dynamic";

import PageClient from "./pageClient";
import { readConfig } from "../shared/serverHelperFunctions";
import { Config } from "../shared/config";

export default async function () {
    const config: Config = readConfig();
    return <PageClient config={config} />
}