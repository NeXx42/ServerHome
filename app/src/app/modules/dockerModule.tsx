import CardComponent from "../components/cardComponent";
import Component from "../components/component";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput) {
    const aliveContainerCount = props.sysInfo?.containers?.filter(c => c.status === "running" || c.status === "healthy").length ?? 0;

    return (
        <Component title="Docker">
            <CardComponent value={`${aliveContainerCount} / ${props.sysInfo?.containers?.length ?? 0}`} description={`alive containers`} />
        </Component>
    )
}