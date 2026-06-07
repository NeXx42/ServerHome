export const dynamic = "force-dynamic";

import PageClient from "./pageClient";
import { Config } from "../shared/types";
import { readConfig } from "../shared/serverHelperFunctions";

export default async function () {
    const config: Config = readConfig();
    return <PageClient config={config} />
}