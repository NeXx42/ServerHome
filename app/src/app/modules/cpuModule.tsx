import CardComponent from "../components/cardComponent";
import { GlancesInfo, ModuleInput } from "../shared/types";
import Component from "../components/component";

export default function (props: ModuleInput) {
    return (
        <Component title="CPU Usage">
            <CardComponent value={`${props.sysInfo?.cpu?.total ?? "-"}%`} description={`${props.sysInfo?.cpu?.cpucore} cores - avg`} />
        </Component>
    )
}