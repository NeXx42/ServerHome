import { useEffect, useState } from "react";
import { GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { refitGraph } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

interface MemoryGraphData extends GraphDataPoint {
    mean?: number;
}

export default function (props: ModuleInput) {
    const [data, setData] = useState<GraphData<MemoryGraphData>>({
        data: [],
        series: [{
            fieldName: "mean",

            lineColour: "#8884d8",
            areaColour: "#8884d8"
        }],
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            setData(prev =>
                refitGraph(prev, time, {
                    mean: info.mem?.percent_mean
                })
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