import { ReactNode, useEffect, useState } from "react";
import Component from "../components/component";
import { Config_Module } from "../shared/config";
import { ModuleInput } from "../shared/types";

import "./linksModule.css"

interface Config_Links extends Config_Module {
    links?: Config_Link[]
}

interface Config_Link {
    name?: string;
    iconUrl?: string;
    url?: string;
}


export default function (props: ModuleInput<Config_Links>) {
    return (
        <Component title="Links" rowSpan={2} columnSpan={4} onEdit={() => props.requestModal(<Modal linksTruth={props.config.links ?? []} />)}>
            <div className="Component_Links">
                {
                    props.config.links?.map(l => <a key={l.url} href={l.url ?? ""} target="_blank">
                        {l.iconUrl && <img src={l.iconUrl} />}
                        <p>{l.name ?? "-"}</p>
                    </a>)
                }
            </div>
        </Component>
    )
}

function Modal({ linksTruth }: { linksTruth: Config_Link[] }): ReactNode {
    const [links, setLinks] = useState<Config_Link[]>(linksTruth);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | undefined>(undefined);

    useEffect(() => setLinks(linksTruth), [linksTruth]);

    const addLink = () => {
        setLinks(prev => [
            ...prev,
            {

            }
        ])
    }

    const removeLink = (pos: number) => {
        setLinks(prev => prev.filter((_, i) => i !== pos))
    }

    const updateLink = (pos: number, field: keyof Config_Link, value: string) => {
        setLinks(prev => (
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

        fetch("/api/config/links", {
            method: "POST",
            body: JSON.stringify(links)
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
        <div className="Modal_EditLinks">
            <h2>Edit Links</h2>

            {
                msg && <span>{msg}</span>
            }

            <div className="Modal_EditLinks_Container">
                {links?.map((l, i) => (
                    <div key={i} className="Modal_EditLinks_Entry">
                        <div>
                            <label>Title</label>
                            <input value={l.name ?? ""} onChange={e => updateLink(i, "name", e.target.value)} />
                        </div>
                        <div>
                            <label>Link</label>
                            <input value={l.url ?? ""} onChange={e => updateLink(i, "url", e.target.value)} />
                        </div>
                        <div>
                            <label>Icon</label>
                            <input value={l.iconUrl ?? ""} onChange={e => updateLink(i, "iconUrl", e.target.value)} />
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
                    <div className="Modal_EditLinks_Controls">
                        <button onClick={addLink}>Add</button>
                        <button onClick={save}>Save</button>
                    </div>
                )
            }
        </div>
    )
}