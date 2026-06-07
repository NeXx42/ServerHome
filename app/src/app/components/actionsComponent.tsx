import { Config_Actions } from "../shared/types";

import "./actionsComponent.css"

export default function ({ actions }: { actions: Config_Actions[] }) {
    return (<div className="Component_Actions">
        {
            actions.map((a, i) => (
                <button key={i}>
                    <div className="Component_Actions_Info">
                        <h3>{a.name}</h3>
                        <span>{a.description}</span>
                    </div>
                </button>
            ))
        }
    </div>)
}