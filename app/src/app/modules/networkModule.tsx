import CardComponent from "../components/cardComponent";
import { ModuleInput } from "../shared/types";
import Component from "../components/component";

export default function (props: ModuleInput<any>) {
    const vals = props?.sysInfo?.network?.reduce((acc, curr) => {
        return {
            in: acc.in + (curr.bytes_recv_rate_per_sec ?? 0),
            out: acc.out + (curr.bytes_sent_rate_per_sec ?? 0)
        }
    }, { in: 0, out: 0 })

    return (
        <Component title="Network Usage">
            <CardComponent value={`${vals?.in} in / ${vals?.out} out`} description={`byte rate per second`} />
        </Component>
    )
}