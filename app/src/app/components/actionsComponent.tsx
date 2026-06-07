import { Config_Actions } from "../shared/types";

import "./actionsComponent.css"

export default function ({ actions }: { actions: Config_Actions[] }) {
    const invokeScript = (scriptName?: string) => {
        if (!scriptName)
            return;

        fetch("api/runner", {
            method: "POST",
            body: JSON.stringify({
                scriptName: scriptName
            })
        })
    }

    return (<div className="Component_Actions">
        {
            actions.map((a, i) => (
                <button key={i}>
                    <div className="Component_Actions_Info" onClick={() => invokeScript(a.scriptName)}>
                        <h3>{a.name}</h3>
                        <span>{a.description}</span>
                    </div>
                </button>
            ))
        }
    </div>)
}