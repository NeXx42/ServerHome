import { Config_Links } from "../shared/types";

import "./linksComponent.css"

export default function ({ links }: { links: Config_Links[] }) {
    return (<div className="Component_Links">
        {
            links.map(l => <a key={l.url} href={l.url ?? ""} target="_blank">
                {l.iconUrl && <img src={l.iconUrl} />}
                <p>{l.name ?? "-"}</p>
            </a>)
        }
    </div>)
}