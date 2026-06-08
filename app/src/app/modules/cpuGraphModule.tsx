import { useEffect, useState } from "react";
import { GraphData, ModuleInput } from "../shared/types";
import { convertArrayToData, GraphColours, refitGraph, saveConfig } from "../shared/helperFunctions";
import { Config_Module } from "../shared/config";

import GraphComponent from "../components/graphComponent";
import Component from "../components/component";

interface CPUGraphConfig extends Config_Module {
    separateCores?: boolean
}

export default function (props: ModuleInput<CPUGraphConfig>) {
    const [data, setData] = useState<GraphData<any>>({
        data: [],
        series: [{
            fieldName: "value",

            lineColour: GraphColours[0],
            areaColour: GraphColours[0],
        }]
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            if (props.config.separateCores) {
                const data = convertArrayToData(info.percpu ?? [], "cpu_number", "total");

                setData(prev => {
                    prev.series = data.series;
                    return refitGraph(prev, time, {
                        ...data.flatData
                    });
                });
            }
            else {
                setData(prev => {
                    return refitGraph(prev, time, {
                        value: info.cpu?.total ?? 0
                    });
                });
            }

        });

        return unsubscribe;
    }, []);

    return (
        <Component title="CPU Usage" rowSpan={2} columnSpan={2} onEdit={() => props.requestModal(<Modal id={props.pos} configTruth={props.config} />)} >
            <GraphComponent dataPoints={data} showLegend={data.series.length > 1} />
        </Component>
    )
}


function Modal({ id, configTruth }: { id: number, configTruth: CPUGraphConfig }) {
    const [config, setConfig] = useState(configTruth);
    useEffect(() => setConfig(configTruth), [configTruth]);

    const save = () => {
        saveConfig<CPUGraphConfig>(id, config);
    }

    function updateProperty<K extends keyof CPUGraphConfig>(fieldName: keyof CPUGraphConfig, value: CPUGraphConfig[K]) {
        setConfig(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (<>
        <div>
            <label>Separate Cores</label>
            <input type="checkbox" checked={config.separateCores ?? false} onChange={() => updateProperty("separateCores", !(config.separateCores ?? false))} />
        </div>
        <button onClick={save}>Save</button>
    </>)
}