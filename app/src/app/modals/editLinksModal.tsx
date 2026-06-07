import { useEffect, useState } from "react"
import { Config_Links } from "../shared/types"

import "./editLinksModal.css"

export default function ({ linksTruth }: { linksTruth: Config_Links[] }) {
    const [links, setLinks] = useState<Config_Links[]>(linksTruth);

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

    const updateLink = (pos: number, field: keyof Config_Links, value: string) => {
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