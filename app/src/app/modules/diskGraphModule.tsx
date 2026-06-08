import { useEffect, useState } from "react";
import { GlancesInfo, GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { convertArrayToData, refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

type DiskGraphData = GraphDataPoint & {
    [key: string]: number;
};

export default function (props: ModuleInput<any>) {
    const [data, setData] = useState<GraphData<DiskGraphData>>({
        data: [],
        series: []
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            const data = convertArrayToData(info.diskio ?? [], "disk_name", "read_time_rate_per_sec");

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
        <Component title="Disk Usage" rowSpan={2} columnSpan={2} >
            <GraphComponent dataPoints={data} />
        </Component>
    )
}