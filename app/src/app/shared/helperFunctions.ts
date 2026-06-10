import { Config_Module } from "./config";
import { GraphData, GraphDataPoint } from "./types";

export const byteToGb = (num: number) => (num * 1e9).toFixed(1);
export const bytesToGiB = (bytes: number) => (bytes / 1024 ** 3).toFixed(1);

export const maxGraphPoints = 100;

export function refitGraph<T extends GraphDataPoint>(graph: GraphData<T>, currentTime: number, data: T): GraphData<T> {
    return {
        ...graph,
        data: [
            ...graph.data.slice(-maxGraphPoints),
            {
                ...data,
                time: currentTime,
            }
        ]
    }
}

export const GraphColours = [
    "#60a5fa", // blue
    "#34d399", // emerald
    "#fbbf24", // amber
    "#fb7185", // rose
    "#a78bfa", // violet
    "#22d3ee", // cyan
    "#f97316", // orange
    "#94a3b8", // slate
    "#4ade80", // green
    "#38bdf8", // sky
    "#f472b6", // pink
    "#c084fc", // purple

    "#ef4444", // red
    "#14b8a6", // teal
    "#8b5cf6", // indigo
    "#eab308", // yellow
    "#06b6d4", // light cyan
    "#84cc16", // lime
    "#ec4899", // fuchsia
    "#6366f1", // indigo
    "#10b981", // emerald dark
    "#f43f5e", // rose dark
    "#0ea5e9", // sky dark
    "#d946ef", // magenta
];

export function convertArrayToData<T>(data: T[], nameField: keyof T, valueField: keyof T) {
    const flatData: Record<string, number> = {};
    const series: {
        fieldName: string;
        lineColour: string;
        areaColour: string;
    }[] = [];

    for (let i = 0; i < data.length; i++) {
        const d = data![i];
        const name = String(d[nameField]);
        const value = Number(d[valueField] ?? 0);

        flatData[name] = value;

        series.push({
            fieldName: name,
            lineColour: GraphColours[i],
            areaColour: GraphColours[i],
        });
    }

    return {
        flatData,
        series
    }
}

export async function saveConfig<T extends Config_Module>(index: number, config: T): Promise<Response> {
    const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({
            id: index,
            config: config
        })
    });

    if (!res.ok)
        throw new Error("Failed");

    window.location.reload();
    return res;
}