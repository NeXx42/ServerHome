import { Config } from "./config";

export interface SessionInfo {
    id: string;
    config: Config;
    keepAlive: number;
}