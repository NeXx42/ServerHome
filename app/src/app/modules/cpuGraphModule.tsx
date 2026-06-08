import { useEffect, useState } from "react";
import { GlancesInfo, GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

type CpuGraphData = GraphDataPoint & {
    [key: string]: number;
};

export const cpuColors = [
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
];

export default function (props: ModuleInput) {
    const [maxValue, setMaxValue] = useState<number>(100);
    const [data, setData] = useState<GraphData<CpuGraphData>>({
        data: [],
        series: []
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            const cores = info.percpu?.reduce((acc, c, i) => {
                acc[`cpu${c!.cpu_number!.toString()}`] = c.total ?? 0
                return acc;
            }, {} as Record<string, number>);

            setMaxValue(20);

            setData(prev => {
                prev.series = info.percpu?.map(c => ({
                    fieldName: `cpu${c!.cpu_number!.toString()}`,
                    lineColour: cpuColors[c!.cpu_number!],
                    areaColour: cpuColors[c!.cpu_number!],
                })) ?? []

                return refitGraph(prev, time, {
                    ...cores
                })
            });
        });

        return unsubscribe;
    }, []);

    console.log(data);

    return (
        <Component title="CPU Usage" rowSpan={2} columnSpan={2} >
            <GraphComponent dataPoints={data} />
        </Component>
    )
}