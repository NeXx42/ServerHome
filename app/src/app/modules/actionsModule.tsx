import { ReactNode, useEffect, useState } from "react";
import Component from "../components/component";
import { Config_Module } from "../shared/config";
import { ModuleInput } from "../shared/types";

import "./actionsModule.css"

export interface Config_Actions extends Config_Module {
    actions?: Config_Action[];
}

export interface Config_Action {
    name?: string;
    description?: string;
    scriptName?: string;
    curlName?: string;
}

export default function (props: ModuleInput<Config_Actions>) {
    const [runningActions, setRunningActions] = useState<number[]>([])

    useEffect(() => {
        if (runningActions.length === 0) return;

        const handler = (e: any) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);

        return () => {
            window.removeEventListener("beforeunload", handler);
        };
    }, [runningActions]);

    const invokeScript = (pos: number, action: Config_Action) => {
        if (runningActions.indexOf(pos) !== -1)
            return;

        setRunningActions(prev => [
            ...prev,
            pos
        ])

        fetch("/api/runner", {
            method: "POST",
            body: JSON.stringify({
                scriptName: action.scriptName,
                curlName: action.curlName
            })
        })
            .finally(() => setRunningActions(prev => prev.filter((_, i) => i !== pos)));
    }


    return (
        <Component title="Actions" rowSpan={4} columnSpan={2} onEdit={() => props.requestModal(<Modal id={props.pos} config={props.config} />)}>
            <div className="Component_Actions">
                {
                    props.config.actions?.map((a, i) => (
                        <button key={i} className="Component_Actions_Entry" onClick={() => invokeScript(i, a)}>
                            <div className="Component_Actions_Info" >
                                <h3>{a.name}</h3>
                                <span>{a.description}</span>
                            </div>
                            {
                                runningActions.indexOf(i) !== -1 && (
                                    <svg width="40" height="40" viewBox="0 0 50 50">
                                        <circle
                                            cx="25"
                                            cy="25"
                                            r="20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray="31.4 31.4"
                                        >
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                from="0 25 25"
                                                to="360 25 25"
                                                dur="0.8s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </svg>
                                )
                            }
                        </button>
                    ))
                }
            </div>
        </Component>
    )
}


function Modal({ id, config }: { id: number, config: Config_Actions }): ReactNode {
    const [actions, setActions] = useState<Config_Action[]>(config.actions ?? []);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | undefined>(undefined);

    useEffect(() => setActions(config.actions ?? []), [config]);

    const addLink = () => {
        setActions(prev => [
            ...prev,
            {}
        ])
    }

    const removeLink = (pos: number) => {
        setActions(prev => prev.filter((_, i) => i !== pos))
    }

    const updateLink = (pos: number, field: keyof Config_Action, value: string) => {
        setActions(prev => (
            prev.map((p, i) => {
                if (i !== pos) return p;
                return {
                    ...p,
                    [field]: value
                }
            })
        ))
    }

    const save = () => {
        setLoading(true);
        setMsg("");

        fetch("/api/config/actions", {
            method: "POST",
            body: JSON.stringify({
                id: id,
                config: {
                    ...config,
                    actions: actions
                }
            })
        })
            .then(r => {
                if (!r.ok)
                    throw new Error("Failed");

                setMsg("Saved");
                window.location.reload();
            })
            .catch(e => setMsg(`Error: ${e.message}`))
            .finally(() => setLoading(false));
    }

    return (
        <div className="Modal_EditActions">
            <h2>Edit Actions</h2>

            {
                msg && <span>{msg}</span>
            }

            <div className="Modal_EditActions_Container">
                {actions?.map((a, i) => (
                    <div key={i} className="Modal_EditActions_Entry">
                        <div>
                            <label>Title</label>
                            <input value={a.name ?? ""} onChange={e => updateLink(i, "name", e.target.value)} />
                        </div>
                        <div>
                            <label>Description</label>
                            <input value={a.description ?? ""} onChange={e => updateLink(i, "description", e.target.value)} />
                        </div>
                        <div>
                            <label>Curl Name</label>
                            <input value={a.curlName ?? ""} onChange={e => updateLink(i, "curlName", e.target.value)} />
                        </div>
                        <div>
                            <label>Script Name</label>
                            <input value={a.scriptName ?? ""} onChange={e => updateLink(i, "scriptName", e.target.value)} />
                        </div>
                        <button onClick={() => removeLink(i)}>Remove</button>
                    </div>
                ))}
            </div>
            {
                loading ? (
                    <div>
                        Loading...
                    </div>
                ) : (
                    <div className="Modal_EditActions_Controls">
                        <button onClick={addLink}>Add</button>
                        <button onClick={save}>Save</button>
                    </div>
                )
            }
        </div>
    )
}