import "./cardComponent.css"

interface Props {
    value: string,
    description: string
}

export default function (props: Props) {
    return (
        <div className="Component_Card">
            <h2>{props.value}</h2>
            <span>{props.description}</span>
        </div>
    )
}