import { useEffect, useState } from "react"
import { Config_Actions, Config_Links } from "../shared/types"

import "./editActionsModal.css"

export default function ({ actionsTruth }: { actionsTruth: Config_Actions[] }) {
    const [actions, setActions] = useState<Config_Actions[]>(actionsTruth);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | undefined>(undefined);

    useEffect(() => setActions(actionsTruth), [actionsTruth]);

    const addLink = () => {
        setActions(prev => [
            ...prev,
            {

            }
        ])
    }

    const removeLink = (pos: number) => {
        setActions(prev => prev.filter((_, i) => i !== pos))
    }

    const updateLink = (pos: number, field: keyof Config_Actions, value: string) => {
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
            body: JSON.stringify(actions)
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