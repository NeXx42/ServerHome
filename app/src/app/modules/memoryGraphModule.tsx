import { useEffect, useState } from "react";
import { GraphData, ModuleInput } from "../shared/types";
import { refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

export default function (props: ModuleInput) {
    const [data, setData] = useState<GraphData[]>([]);

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            setData(prev =>
                refitGraph(prev, time, info.mem?.percent_mean?.toString() ?? "-")
            );
        });

        return unsubscribe;
    }, []);

    return (
        <Component title="Memory Usage" rowSpan={2} columnSpan={2}>
            <GraphComponent dataPoints={data} domain={[0, 100]} />
        </Component>
    )
}