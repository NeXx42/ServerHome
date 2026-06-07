import { useEffect, useState } from "react";
import { Config_Actions } from "../shared/types";

import "./actionsComponent.css"

export default function ({ actions }: { actions: Config_Actions[] }) {
    const [runningActions, setRunningActions] = useState<number[]>([])

    useEffect(() => {
        if (runningActions.length === 0) return;

        const handler = (e: any) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);

        return () => {
            window.removeEventListener("beforeunload", handler);
        };
    }, [runningActions]);

    const invokeScript = (pos: number, action: Config_Actions) => {
        if (runningActions.indexOf(pos) !== -1)
            return;

        setRunningActions(prev => [
            ...prev,
            pos
        ])

        fetch("/api/runner", {
            method: "POST",
            body: JSON.stringify({
                scriptName: action.scriptName,
                curlName: action.curlName
            })
        })
            .finally(() => setRunningActions(prev => prev.filter((_, i) => i !== pos)));
    }

    return (<div className="Component_Actions">
        {
            actions.map((a, i) => (
                <button key={i} className="Component_Actions_Entry" onClick={() => invokeScript(i, a)}>
                    <div className="Component_Actions_Info" >
                        <h3>{a.name}</h3>
                        <span>{a.description}</span>
                    </div>
                    {
                        runningActions.indexOf(i) !== -1 && (
                            <svg width="40" height="40" viewBox="0 0 50 50">
                                <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray="31.4 31.4"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 25 25"
                                        to="360 25 25"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        )
                    }
                </button>
            ))
        }
    </div>)
}