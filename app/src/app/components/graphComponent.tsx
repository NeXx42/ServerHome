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
    Legend,
} from "recharts";

import "./graphComponent.css"
import { GraphData } from "../shared/types";

interface Props {
    dataPoints: GraphData<any>;

    domain?: number[];
    showLegend?: boolean;
}

export default function (props: Props) {
    return (
        <div className="Component_Graph">
            <ResponsiveContainer>
                <AreaChart data={props.dataPoints.data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#cccccc2f" vertical={false} />

                    {
                        (props.showLegend ?? true) && <Legend fontSize={10} />
                    }

                    <XAxis dataKey="relativeTime" stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `${Math.round(value)}s`} axisLine={false} fontSize={12} tickCount={5} minTickGap={70} interval="preserveStartEnd" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={props.domain} axisLine={false} width={40} fontSize={12} interval="preserveStartEnd" />
                    {
                        props.dataPoints.series.map(s => (
                            <Area
                                key={s.fieldName}
                                type="monotone"
                                dataKey={s.fieldName}
                                stroke={s.lineColour}
                                strokeWidth={2}
                                fill={s.areaColour}
                                fillOpacity={0.3}
                                animationDuration={.2}
                            />
                        ))
                    }
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}