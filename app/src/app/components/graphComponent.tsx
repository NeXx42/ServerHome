"use client";

import {
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
    updateRate: number;
    dataPoints: GraphData<any>;

    domain?: number[];
    showLegend?: boolean;
}


export default function (props: Props) {
    const tickFormatter = (t: number) => {
        const msAgo = (t - now);

        return msAgo > 10 ? "now" : `${(msAgo / 1000).toFixed(props.updateRate < 1000 ? 1 : 0)}s`;
    }

    const now = Date.now();

    const duration = props.updateRate * 10;
    const start = Math.max(props?.dataPoints?.data?.[0]?.time ?? now, now - duration);

    const ticks = Array.from({ length: 6 }, (_, i) =>
        start + (duration * i) / 5
    );

    return (
        <div className="Component_Graph">
            <ResponsiveContainer>
                <AreaChart data={props.dataPoints.data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#cccccc2f" vertical={false} />

                    {
                        (props.showLegend ?? true) && <Legend fontSize={10} />
                    }

                    <XAxis
                        type="number"
                        dataKey="time"
                        scale="time"
                        domain={[start, now]}
                        allowDataOverflow
                        ticks={ticks}
                        tickFormatter={tickFormatter}
                        fontSize={12}
                        axisLine={false}
                    />
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
                                fillOpacity={0.2}
                                isAnimationActive={true}
                                animationDuration={Math.max(props.updateRate * .8, 200)}
                                animationEasing="ease-out"
                            />
                        ))
                    }
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}