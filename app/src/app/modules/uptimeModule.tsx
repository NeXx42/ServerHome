import CardComponent from "../components/cardComponent";
import Component from "../components/component";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput<any>) {
    return (
        <Component title="Uptime">
            <CardComponent value={`${props.sysInfo?.uptime ?? "-"}`} description="since last restart" />
        </Component>
    )
}