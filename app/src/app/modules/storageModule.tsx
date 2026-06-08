import Component from "../components/component";
import StorageComponent from "../components/storageComponent";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput<any>) {
    return (
        <Component title="Storage" rowSpan={2} columnSpan={4}  >
            <StorageComponent fs={props.sysInfo?.fs ?? []} />
        </Component>
    )
}