import { GraphData } from "./types";

export const byteToGb = (num: number) => (num * 1e9).toFixed(1);
export const bytesToGiB = (bytes: number) => (bytes / 1024 ** 3).toFixed(1);

export const maxGraphPoints = 100;

export const refitGraph = (graph: GraphData[], currentTime: number, newDataPoint: string) => {
    return [
        ...graph.slice(-maxGraphPoints).map(p => ({
            ...p,
            relativeTime: (p.time - currentTime) / 1000
        })),
        {
            time: currentTime,
            relativeTime: 0,

            value: newDataPoint,
        }
    ]
}
