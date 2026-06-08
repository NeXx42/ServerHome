import { useEffect, useState } from "react";
import Component from "../components/component";
import { Config_Module } from "../shared/config";
import { ModuleInput } from "../shared/types";

import "./containersModule.css"
import { saveConfig } from "../shared/helperFunctions";

interface ContainerConfig extends Config_Module {
    showPorts?: boolean;
}


const isActive = (status?: string) => {
    switch (status) {
        case "running":
        case "healthy":
            return true;

        default:
            return false;
    }
}

export default function (props: ModuleInput<ContainerConfig>) {
    return (
        <Component title="Docker" rowSpan={4} columnSpan={2} onEdit={() => props.requestModal(<Modal id={props.pos} configTruth={props.config} />)}>
            <div className="Component_Docker">
                {
                    props.sysInfo?.containers?.sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0).map(c => (
                        <div key={c.id} className="Component_Docker_Element">
                            <div className="Component_Docker_Element_Info">
                                <p>{c.name}</p>
                                <p>{c.image}</p>
                            </div>
                            {
                                (props.config?.showPorts ?? false) && (
                                    <span className="Component_Docker_Element_Ports" title={c.ports}>{c.ports}</span>
                                )
                            }
                            <span className="Component_Docker_Element_Uptime">{c.uptime ?? "-"}</span>
                            <p className={`Component_Docker_Element_Status ${isActive(c.status) ? "Active" : ""}`}>{c.status}</p>
                        </div>
                    ))
                }
            </div>
        </Component>
    )
}

function Modal({ id, configTruth }: { id: number, configTruth: ContainerConfig }) {
    const [config, setConfig] = useState(configTruth);
    useEffect(() => setConfig(configTruth), [configTruth]);

    const save = () => {
        saveConfig<ContainerConfig>(id, config);
    }

    function updateProperty<K extends keyof ContainerConfig>(fieldName: keyof ContainerConfig, value: ContainerConfig[K]) {
        setConfig(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (<>
        <div>
            <label>Separate Cores</label>
            <input type="checkbox" checked={config.showPorts ?? false} onChange={() => updateProperty("showPorts", !(config.showPorts ?? false))} />
        </div>
        <button onClick={save}>Save</button>
    </>)
}