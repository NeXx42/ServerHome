"use client"

import "./component.css"

interface Props {
    children?: any;

    title: string;
    onEdit?: () => void;

    rowSpan?: number;
    columnSpan?: number;
}

export default function (props: Props) {
    return (
        <div className="Container" style={{ gridRow: props.rowSpan ? `span ${props.rowSpan}` : "", gridColumn: props.columnSpan ? `span ${props.columnSpan}` : "" }}>
            <div className="Container_header">
                <h3>{props.title}</h3>
                {props.onEdit && <button onClick={() => props.onEdit!()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                    </svg>
                </button>}
            </div>

            {props.children}
        </div>
    )
}