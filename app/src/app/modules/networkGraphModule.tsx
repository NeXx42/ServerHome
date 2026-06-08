import { useEffect, useState } from "react";
import { GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { convertArrayToData, refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

type CpuGraphData = GraphDataPoint & {
    [key: string]: number;
};

export default function (props: ModuleInput<any>) {
    const [data, setData] = useState<GraphData<CpuGraphData>>({
        data: [],
        series: []
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            const data = convertArrayToData(info.network ?? [], "interface_name", "bytes_all");

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
        <Component title="Network Usage" rowSpan={2} columnSpan={2} >
            <GraphComponent dataPoints={data} />
        </Component>
    )
}