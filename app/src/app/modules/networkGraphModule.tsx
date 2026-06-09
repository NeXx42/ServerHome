import { ReactNode, useEffect, useState } from "react";
import { GraphData, GraphDataPoint, ModuleInput } from "../shared/types";
import { convertArrayToData, refitGraph, saveConfig } from "../shared/helperFunctions";
import GraphComponent from "../components/graphComponent";
import Component from "../components/component";
import { Config_Module } from "../shared/config";

import "./networkGraphModule.css"

type CpuGraphData = GraphDataPoint & {
    [key: string]: number;
};

interface NetworkGraphConfig extends Config_Module {
    filterIsHide: boolean;
    filters?: string[];
}

export default function (props: ModuleInput<NetworkGraphConfig>) {
    const [data, setData] = useState<GraphData<CpuGraphData>>({
        data: [],
        series: []
    });

    useEffect(() => {
        const unsubscribe = props.pollEmitter.subscribe((info, time) => {
            const interfaces = (info.network ?? []).map(n => ({
                ...n,
                inFilter: (props.config.filters?.indexOf(n.interface_name ?? "") ?? -1) > 0
            })).filter(i => i.inFilter !== (props.config.filterIsHide ?? false));

            const data = convertArrayToData(interfaces ?? [], "interface_name", "bytes_all");

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
        <Component title="Network Usage" rowSpan={2} columnSpan={2} onEdit={() => props.requestModal(<Modal props={props} />)}>
            <GraphComponent dataPoints={data} updateRate={props.pollRate} />
        </Component>
    )
}


function Modal({ props }: { props: ModuleInput<NetworkGraphConfig> }) {
    const [config, setConfig] = useState(props.config);
    useEffect(() => setConfig(props.config), [props.config]);

    const save = () => {
        saveConfig<NetworkGraphConfig>(props.pos, config);
    }

    function updateProperty<K extends keyof NetworkGraphConfig>(fieldName: keyof NetworkGraphConfig, value: NetworkGraphConfig[K]) {
        setConfig(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const addInterface = () => {
        setConfig(prev => ({
            ...prev,
            filters: [...prev.filters ?? [], ""]
        }))
    }

    const removeInterface = (pos: number) => {
        setConfig(prev => ({
            ...prev,
            filters: (prev.filters ?? []).filter((_, i) => i !== pos)
        }))
    }

    const updateInterface = (pos: number, value: string) => {
        setConfig(prev => ({
            ...prev,
            filters: (prev.filters ?? []).map((v, i) => {
                if (i !== pos) return v;
                return value;
            })
        }))
    }

    const interfacesOptions: ReactNode = (props.sysInfo?.network ?? [])
        .sort((a, b) => (a.interface_name ?? "").localeCompare(b.interface_name ?? ""))
        .map(n => <option key={n.interface_name} value={n.interface_name}>{n.interface_name}</option>)

    return (<>
        <h1>Network Graph</h1>
        <div className="NetworkGraphModal">
            <div className="NetworkGraphModal_Inputs">
                <label>Filter Is Hide</label>
                <input type="checkbox" checked={config.filterIsHide} onChange={() => updateProperty("filterIsHide", !(config.filterIsHide ?? false))} />
            </div>
            <div className="NetworkGraphModal_Filters">
                {
                    config.filters?.map((f, i) => (
                        <div key={i}>
                            <select value={f} onChange={e => updateInterface(i, e.target.value)}>
                                {interfacesOptions}
                            </select>
                            <button className="negative" onClick={() => removeInterface(i)}>Remove</button>
                        </div>
                    ))
                }
                <button onClick={addInterface}>Add</button>
            </div>
        </div>
        <button className="NetworkGraphModal_Submit" onClick={save}>Save</button>
    </>)
}