export interface Config {
    title?: string;
    glancesUrl: string;
    webhookConsumerUrl?: string;

    modules?: Config_Module[];
}

export interface Config_Module {
    type: string;
}