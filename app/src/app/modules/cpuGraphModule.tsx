import { useEffect, useState } from "react";
import { GlancesInfo, GraphData, ModuleInput } from "../shared/types";
import { refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

export default function (props: ModuleInput) {
    const [data, setData] = useState<GraphData[]>([]);

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            setData(prev =>
                refitGraph(prev, time, info?.cpu?.total?.toString() ?? "-")
            );
        });

        return unsubscribe;
    }, []);

    return (
        <Component title="CPU Usage" rowSpan={2} columnSpan={2} >
            <GraphComponent dataPoints={data} domain={[0, 100]} />
        </Component>
    )
}