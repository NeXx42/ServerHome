import { GraphData, GraphDataPoint } from "./types";

export const byteToGb = (num: number) => (num * 1e9).toFixed(1);
export const bytesToGiB = (bytes: number) => (bytes / 1024 ** 3).toFixed(1);

export const maxGraphPoints = 100;

export function refitGraph<T extends GraphDataPoint>(graph: GraphData<T>, currentTime: number, data: T): GraphData<T> {
    return {
        ...graph,
        data: [
            ...graph.data.slice(-maxGraphPoints).map(p => ({
                ...p,
                relativeTime: ((p.time ?? 0) - currentTime) / 1000
            })),
            {
                ...data,
                time: currentTime,
                relativeTime: 0,
            }
        ]
    }
}
