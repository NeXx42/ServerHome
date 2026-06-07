"use client"
import { ReactNode, useEffect, useState } from "react";

import GraphComponent from "../components/graphComponent";
import { Config, GlancesInfo, GraphData } from "../shared/types";

import "./page.css"
import CardComponent from "../components/cardComponent";
import StorageComponent from "../components/storageComponent";
import { bytesToGiB } from "../shared/helperFunctions";
import Component from "../components/component";
import DockerComponent from "../components/dockerComponent";
import ActionsComponent from "../components/actionsComponent";
import LinksComponent from "../components/linksComponent";
import { createPortal } from "react-dom";
import EditActionsModal from "../modals/editActionsModal";
import EditLinksModal from "../modals/editLinksModal";


type Menus = "None" | "ActionsEdit" | "ActionsExecute" | "LinksEdit";

const updateIntervals = [
    500,
    1000,
    2000,
    5000,
    10000,
]
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

async function fetchSysInfo(url: string): Promise<GlancesInfo> {

    if (url.endsWith("/"))
        url = url.substring(0, url.length - 1);

    const res = await fetch(`${url}/api/4/all`);

    //if (!res.ok)
    return res.json();
}

export default function ({ config }: { config: Config }) {
    const [sysInfo, setSysInfo] = useState<GlancesInfo | undefined>();

    const [cpuData, setCpuData] = useState<GraphData[]>([]);
    const [memoryData, setMemoryData] = useState<GraphData[]>([]);

    const [currentPollInterval, setCurrentPollInterval] = useState(1);

    const [currentMenu, setCurrentMenu] = useState<Menus>("None")

    useEffect(() => {
        const work = () => {
            fetchSysInfo(config.glancesUrl)
                .then((result) => {
                    const currentTime = Date.now();
                    setSysInfo(result);

                    setCpuData((prev) => refitGraph(prev, currentTime, result?.cpu?.total?.toString() ?? "-"));
                    setMemoryData((prev) => refitGraph(prev, currentTime, result?.mem?.percent_mean?.toString() ?? "-"));
                });
        }

        work();
        const timer = setInterval(() => work(), updateIntervals[currentPollInterval]);

        return () => clearInterval(timer);
    }, [currentPollInterval]);

    const aliveContainerCount = sysInfo?.containers?.filter(c => c.status === "running" || c.status === "healthy").length ?? 0;

    const drawSubMenu = () => {
        let node: ReactNode | undefined = undefined;

        switch (currentMenu) {

            case "ActionsEdit": node = <EditActionsModal actionsTruth={config.actions ?? []} />; break;
            case "LinksEdit": node = <EditLinksModal linksTruth={config.links ?? []} />; break;
        }

        if (!node)
            return <></>

        return createPortal(<div className="Modal" onClick={() => setCurrentMenu("None")}>
            <div className="Modal_Container" onClick={e => e.stopPropagation()}>
                {node}
            </div>
        </div>, document.body)
    }

    return (
        <div className="HomePage">
            <div className="HomePage_Info">
                <h1>{config.title ?? "Dashboard"}</h1>
                <div className="HomePage_Info_Polling">
                    Poll rate
                    <div>
                        <button className={currentPollInterval === 0 ? "Selected" : ""} onClick={() => setCurrentPollInterval(0)}>500ms</button>
                        <button className={currentPollInterval === 1 ? "Selected" : ""} onClick={() => setCurrentPollInterval(1)}>1s</button>
                        <button className={currentPollInterval === 2 ? "Selected" : ""} onClick={() => setCurrentPollInterval(2)}>2s</button>
                        <button className={currentPollInterval === 3 ? "Selected" : ""} onClick={() => setCurrentPollInterval(3)}>5s</button>
                        <button className={currentPollInterval === 4 ? "Selected" : ""} onClick={() => setCurrentPollInterval(4)}>10s</button>
                    </div>
                </div>
            </div>

            <div className="Elements">
                <Component title="CPU Usage">
                    <CardComponent value={`${cpuData[0]?.value ?? "-"}%`} description={`${sysInfo?.cpu?.cpucore} cores - avg`} />
                </Component>
                <Component title="Memory Usage">
                    <CardComponent value={`${memoryData[0]?.value ?? "-"}%`} description={`${bytesToGiB(sysInfo?.mem?.used ?? 0)}GB of ${bytesToGiB(sysInfo?.mem?.total ?? 0)}GB`} />
                </Component>
                <Component title="Docker">
                    <CardComponent value={`${aliveContainerCount} / ${sysInfo?.containers?.length ?? 0}`} description={`alive containers`} />
                </Component>
                <Component title="Uptime">
                    <CardComponent value={`${sysInfo?.uptime ?? "-"}`} description="since last restart" />
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
                <Component title="Actions" rowSpan={4} columnSpan={2} onEdit={() => setCurrentMenu("ActionsEdit")}>
                    <ActionsComponent actions={config.actions ?? []} />
                </Component>


                <Component title="Links" rowSpan={2} columnSpan={4} onEdit={() => setCurrentMenu("LinksEdit")}>
                    <LinksComponent links={config.links ?? []} />
                </Component>
            </div>

            {drawSubMenu()}
        </div >
    );
}