"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

import "./graphComponent.css"
import { GraphData } from "../shared/types";

export default function ({ dataPoints, domain }: { dataPoints: GraphData[], domain: number[] }) {
    return (
        <div className="Component_Graph">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataPoints}>
                    <XAxis dataKey="relativeTime" stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `${Math.round(value)}s`} />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={domain} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}