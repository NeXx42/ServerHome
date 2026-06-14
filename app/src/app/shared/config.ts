export const moduleTypes = [
    "cpu",
    "memory",
    "docker",
    "uptime",
    "network",
    "cpuGraph",
    "diskGraph",
    "memoryGraph",
    "networkGraph",
    "storage",
    "containers",
    "actions",
    "links",
    "containerCpuGraph"] as const;
export type ModuleType = typeof moduleTypes[number];

export interface Config extends ClientConfig {
    glancesUrl: string;
}

export interface ClientConfig {
    title?: string;
    webhookConsumerUrl?: string;
    modules?: Config_Module[];
}


export interface Config_Module {
    type: ModuleType;
}