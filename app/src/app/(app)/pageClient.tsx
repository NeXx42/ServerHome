"use client"
import { useEffect, useState } from "react";

import GraphComponent from "../components/graphComponent";
import { GlancesInfo, GraphData } from "../shared/types";

import "./page.css"
import CardComponent from "../components/cardComponent";
import StorageComponent from "../components/storageComponent";
import { bytesToGiB } from "../shared/helperFunctions";
import Component from "../components/component";
import DockerComponent from "../components/dockerComponent";

const updateInterval = 1000;
const maxGraphPoints = 100;

const refitGraph = (graph: GraphData[], currentTime: number, newDataPoint: string) => {
    return [
        ...graph.slice(-maxGraphPoints).map(p => ({
            ...p,
            relativeTime: (p.time - currentTime) / 1000
        })),
        {
            time: currentTime,
            relativeTime: 0,

            value: newDataPoint,
        }
    ]
}

async function fetchSysInfo(): Promise<GlancesInfo> {
    const res = await fetch("/api/server");

    //if (!res.ok)
    return res.json();
}

export default function () {
    const [sysInfo, setSysInfo] = useState<GlancesInfo | undefined>();

    const [cpuData, setCpuData] = useState<GraphData[]>([]);
    const [memoryData, setMemoryData] = useState<GraphData[]>([]);

    useEffect(() => {
        const work = () => {
            fetchSysInfo()
                .then((result) => {
                    const currentTime = Date.now();
                    setSysInfo(result);

                    setCpuData((prev) => refitGraph(prev, currentTime, result?.cpu?.total?.toString() ?? "-"));
                    setMemoryData((prev) => refitGraph(prev, currentTime, result?.mem?.percent_mean?.toString() ?? "-"));
                });
        }

        work();
        const timer = setInterval(() => work(), updateInterval);

        return () => clearInterval(timer);
    }, [updateInterval]);


    return (
        <div className="HomePage">
            <h1>Server Dashboard</h1>

            <div className="Elements">
                <Component title="CpuUsage">
                    <CardComponent value={`${cpuData[0]?.value ?? "-"}%`} description={`${sysInfo?.cpu?.cpucore} cores - avg`} />
                </Component>
                <Component title="Memory Usage">
                    <CardComponent value={`${memoryData[0]?.value ?? "-"}%`} description={`${bytesToGiB(sysInfo?.mem?.used ?? 0)}GB of ${bytesToGiB(sysInfo?.mem?.total ?? 0)}GB`} />
                </Component>
                <Component title="-">

                </Component>
                <Component title="-">

                </Component>

                <Component title="CPU Usage" rowSpan={2} columnSpan={2} >
                    <GraphComponent dataPoints={cpuData} domain={[0, 100]} />
                </Component>
                <Component title="Memory Usage" rowSpan={2} columnSpan={2}>
                    <GraphComponent dataPoints={memoryData} domain={[0, 100]} />
                </Component>


                <Component title="Storage" rowSpan={2} columnSpan={4}  >
                    <StorageComponent fs={sysInfo?.fs ?? []} />
                </Component>


                <Component title="Docker" rowSpan={4} columnSpan={2}>
                    <DockerComponent containers={sysInfo?.containers ?? []} />
                </Component>
                <Component title="Actions" rowSpan={4} columnSpan={2}>

                </Component>


                <Component title="Links" rowSpan={2} columnSpan={4}>

                </Component>
            </div>
        </div>
    );
}