import Component from "../components/component";
import DockerComponent from "../components/dockerComponent";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput) {
    return (
        <Component title="Docker" rowSpan={4} columnSpan={2}>
            <DockerComponent containers={props.sysInfo?.containers ?? []} />
        </Component>
    )
}