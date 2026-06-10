import { useEffect, useState } from "react";
import { GlancesInfo_Docker, GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { convertArrayToData, refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

interface CpuGraphData extends GraphDataPoint {
    total?: number;
}

export default function (props: ModuleInput<any>) {
    const [data, setData] = useState<GraphData<CpuGraphData>>({
        data: [],
        series: []
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            const containerInfo = (info.containers ?? []).sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")).map((c: GlancesInfo_Docker) => ({
                ...c,
                value: c.cpu?.total ?? 0
            })) ?? []

            const data = convertArrayToData(containerInfo, "name", "value");

            setData(prev => {
                prev.series = data.series;
                return refitGraph(prev, time, {
                    ...data.flatData
                });
            });
        });

        return unsubscribe;
    }, []);

    return (
        <Component title="Container CPU Usage" rowSpan={2} columnSpan={2}>
            <GraphComponent dataPoints={data} updateRate={props.pollRate} />
        </Component>
    )
}