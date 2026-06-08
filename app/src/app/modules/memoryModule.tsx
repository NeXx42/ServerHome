import CardComponent from "../components/cardComponent";
import { GlancesInfo, ModuleInput } from "../shared/types";
import { bytesToGiB } from "../shared/helperFunctions";
import Component from "../components/component";

export default function (props: ModuleInput<any>) {
    return (
        <Component title="Memory Usage">
            <CardComponent value={`${props.sysInfo?.mem?.percent_mean ?? "-"}%`} description={`${bytesToGiB(props.sysInfo?.mem?.used ?? 0)}GB of ${bytesToGiB(props.sysInfo?.mem?.total ?? 0)}GB`} />
        </Component>
    )
}