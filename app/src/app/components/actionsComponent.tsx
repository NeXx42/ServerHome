import { Config_Actions } from "../shared/types";

import "./actionsComponent.css"

export default function ({ actions }: { actions: Config_Actions[] }) {
    const invokeScript = (action: Config_Actions) => {
        fetch("/api/runner", {
            method: "POST",
            body: JSON.stringify({
                scriptName: action.scriptName,
                curlName: action.curlName
            })
        })
    }

    return (<div className="Component_Actions">
        {
            actions.map((a, i) => (
                <button key={i}>
                    <div className="Component_Actions_Info" onClick={() => invokeScript(a)}>
                        <h3>{a.name}</h3>
                        <span>{a.description}</span>
                    </div>
                </button>
            ))
        }
    </div>)
}