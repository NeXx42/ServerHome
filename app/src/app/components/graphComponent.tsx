"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";

import "./graphComponent.css"
import { GraphData } from "../shared/types";

export default function ({ dataPoints, domain }: { dataPoints: GraphData[], domain: number[] }) {
    return (
        <div className="Component_Graph">
            <ResponsiveContainer>
                <AreaChart data={dataPoints} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#cccccc2f" vertical={false} />
                    <XAxis dataKey="relativeTime" stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `${Math.round(value)}s`} axisLine={false} fontSize={12} tickCount={5} minTickGap={70} interval="preserveStartEnd" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={domain} axisLine={false} width={40} fontSize={12} interval="preserveStartEnd" />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        fill="#8884d8"
                        fillOpacity={0.3}
                        animationDuration={.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}