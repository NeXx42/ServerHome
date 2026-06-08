"use client"
import { ReactNode, useEffect, useState } from "react";
import { Config, GlancesInfo, ModuleInput } from "../shared/types";

import "./page.css"
import { createPortal } from "react-dom";
import PollEventEmitter from "../shared/PollEventEmitter";

import CpuModule from "../modules/cpuModule";
import MemoryModule from "../modules/memoryModule";
import CpuGraphModule from "../modules/cpuGraphModule";
import MemoryGraphModule from "../modules/memoryGraphModule";
import DockerModule from "../modules/dockerModule";
import UptimeModule from "../modules/uptimeModule";
import StorageModule from "../modules/storageModule";
import ContainersModule from "../modules/containersModule";
import ActionsModule from "../modules/actionsModule";
import LinksModule from "../modules/linksModule";
import diskGraphModule from "../modules/diskGraphModule";
import networkGraphModule from "../modules/networkGraphModule";

export const pollEmitter = new PollEventEmitter();

const updateIntervals = [
    500,
    1000,
    2000,
    5000,
    10000,
]

async function fetchSysInfo(url: string): Promise<GlancesInfo> {
    if (url.endsWith("/"))
        url = url.substring(0, url.length - 1);

    const res = await fetch(`/api/info?url=${url}`);
    return res.json();
}

export default function ({ config }: { config: Config }) {
    const [sysInfo, setSysInfo] = useState<GlancesInfo | undefined>();
    const [currentPollInterval, setCurrentPollInterval] = useState(1);

    const [currentMenu, setCurrentMenu] = useState<ReactNode | undefined>(undefined)

    useEffect(() => {
        const work = () => {
            fetchSysInfo(config.glancesUrl).then(r => {
                setSysInfo(r);
                pollEmitter.emit(r);
            });

        }

        void work();
        const timer = setInterval(() => work(), updateIntervals[currentPollInterval]);

        return () => clearInterval(timer);
    }, [currentPollInterval]);

    const selectMenu = (node: ReactNode | undefined) => setCurrentMenu(node);

    const drawSubMenu = () => {
        if (!currentMenu)
            return <></>

        return createPortal(<div className="Modal" onClick={() => setCurrentMenu(undefined)}>
            <div className="Modal_Container" onClick={e => e.stopPropagation()}>
                {currentMenu}
            </div>
        </div>, document.body)
    }

    const modules: React.ComponentType<ModuleInput>[] = [
        CpuModule,
        MemoryModule,
        DockerModule,
        UptimeModule,
        CpuGraphModule,
        diskGraphModule,
        MemoryGraphModule,
        networkGraphModule,
        StorageModule,
        ContainersModule,
        ActionsModule,
        LinksModule,
    ];

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
                {modules.map((Module, i) => (
                    <Module
                        key={i}
                        sysInfo={sysInfo}
                        config={config}
                        requestModal={selectMenu}
                        pollEmitter={pollEmitter}
                    />
                ))}
            </div>

            {drawSubMenu()}
        </div >
    );
}