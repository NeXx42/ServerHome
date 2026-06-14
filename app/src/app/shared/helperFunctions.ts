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
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#fb7185",
    "#a78bfa",
    "#22d3ee",
    "#f97316",
    "#94a3b8",
    "#4ade80",
    "#38bdf8",
    "#f472b6",
    "#c084fc",

    "#ef4444",
    "#14b8a6",
    "#8b5cf6",
    "#eab308",
    "#06b6d4",
    "#84cc16",
    "#ec4899",
    "#6366f1",
    "#10b981",
    "#f43f5e",
    "#0ea5e9",
    "#d946ef",
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
    const res = await fetch("/api/module", {
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

export async function saveModules(modules: Config_Module[]): Promise<Response> {
    const res = await fetch("/api/modules", {
        method: "POST",
        body: JSON.stringify(modules)
    });

    if (!res.ok)
        throw new Error("Failed");

    window.location.reload();
    return res;
}