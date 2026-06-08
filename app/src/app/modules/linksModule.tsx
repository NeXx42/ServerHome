import Component from "../components/component";
import LinksComponent from "../components/linksComponent";
import EditLinksModal from "../modals/editLinksModal";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput) {
    return (
        <Component title="Links" rowSpan={2} columnSpan={4} onEdit={() => props.requestModal(<EditLinksModal linksTruth={props.config.links ?? []} />)}>
            <LinksComponent links={props.config.links ?? []} />
        </Component>
    )
}