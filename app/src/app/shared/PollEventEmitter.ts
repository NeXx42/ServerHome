import { GlancesInfo } from "./types";

export default class PollEventEmitter {
    private listeners: ((info: GlancesInfo, time: number) => void)[] = [];

    public subscribe(listener: (info: GlancesInfo, time: number) => void) {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public emit(info: GlancesInfo) {
        const time = Date.now();
        this.listeners.forEach(l => l(info, time));
    }
}