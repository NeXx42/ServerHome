import ActionsComponent from "../components/actionsComponent";
import CardComponent from "../components/cardComponent";
import Component from "../components/component";
import EditActionsModal from "../modals/editActionsModal";
import { ModuleInput } from "../shared/types";

export default function (props: ModuleInput) {
    return (
        <Component title="Actions" rowSpan={4} columnSpan={2} onEdit={() => props.requestModal(<EditActionsModal actionsTruth={props.config.actions ?? []} />)}>
            <ActionsComponent actions={props.config.actions ?? []} />
        </Component>
    )
}