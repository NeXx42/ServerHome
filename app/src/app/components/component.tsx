import "./component.css"

interface Props {
    children?: any;

    title: string;

    rowSpan?: number;
    columnSpan?: number;
}

export default function (props: Props) {
    return (
        <div className="Container" style={{ gridRow: props.rowSpan ? `span ${props.rowSpan}` : "", gridColumn: props.columnSpan ? `span ${props.columnSpan}` : "" }}>
            <h3>{props.title}</h3>
            {props.children}
        </div>
    )
}