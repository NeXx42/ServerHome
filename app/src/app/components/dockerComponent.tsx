import { GlancesInfo, GlancesInfo_Docker } from "../shared/types";
import "./dockerComponent.css"

export default function ({ containers }: { containers: GlancesInfo_Docker[] }) {
    return (<div className="Component_Docker">
        {
            containers.map(c => (
                <div key={c.id} className="Component_Docker_Element">
                    <div className="Component_Docker_Element_Info">
                        <p>{c.name}</p>
                        <p>{c.image}</p>
                    </div>
                    <span className="Component_Docker_Element_Uptime">{c.uptime}</span>
                    <p className="Component_Docker_Element_Status">{c.status}</p>
                </div>
            ))
        }
    </div>)
}