export interface Config extends ClientConfig {
    glancesUrl: string;
}

export interface ClientConfig {
    title?: string;
    webhookConsumerUrl?: string;
    modules?: Config_Module[];
}


export interface Config_Module {
    type: string;
}