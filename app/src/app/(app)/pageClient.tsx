"use client"
import { ReactNode, useEffect, useState } from "react";
import { GlancesInfo, ModuleInput } from "../shared/types";

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
import { ClientConfig, Config_Module, ModuleType } from "../shared/config";
import networkModule from "../modules/networkModule";
import containerCPUGraphModule from "../modules/containerCPUGraphModule";
import PageEdit from "./pageEdit";

export const pollEmitter = new PollEventEmitter();

const updateIntervals = [
    100,
    500,
    1000,
    2000,
    5000,
    10000,
]

async function fetchSysInfo(url: string): Promise<GlancesInfo> {
    if (url.endsWith("/"))
        url = url.substring(0, url.length - 1);

    const res = await fetch(`/api/info?id=${url}`);
    return res.json();
}


const ModuleLookup: Record<ModuleType, React.ComponentType<ModuleInput<any>>> = {
    cpu: CpuModule,
    memory: MemoryModule,
    docker: DockerModule,
    uptime: UptimeModule,
    network: networkModule,
    cpuGraph: CpuGraphModule,
    diskGraph: diskGraphModule,
    memoryGraph: MemoryGraphModule,
    networkGraph: networkGraphModule,
    storage: StorageModule,
    containers: ContainersModule,
    actions: ActionsModule,
    links: LinksModule,
    containerCpuGraph: containerCPUGraphModule
}

export default function ({ config, sessionId }: { config: ClientConfig, sessionId: string }) {
    const [sysInfo, setSysInfo] = useState<GlancesInfo | undefined>();
    const [currentPollInterval, setCurrentPollInterval] = useState(2);
    const [editMode, setEditMode] = useState(false);

    const [currentMenu, setCurrentMenu] = useState<ReactNode | undefined>(undefined)

    useEffect(() => {
        const work = () => {
            fetchSysInfo(sessionId).then(r => {
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

    const drawModules = (configEntry: Config_Module, pos: number) => {
        const Module = ModuleLookup[configEntry.type];
        return Module ? <Module
            key={pos}
            pollRate={updateIntervals[currentPollInterval]}
            pos={pos}
            sysInfo={sysInfo}
            config={configEntry}
            requestModal={selectMenu}
            pollEmitter={pollEmitter}
        /> : null;
    }

    return (
        <div className="HomePage">
            <div className="HomePage_Info">
                <h1>{config.title ?? "Dashboard"}</h1>
                <div className="HomePage_Info_Polling">
                    Poll rate
                    <div>
                        <button className={currentPollInterval === 0 ? "Selected" : ""} onClick={() => setCurrentPollInterval(0)}>100ms</button>
                        <button className={currentPollInterval === 1 ? "Selected" : ""} onClick={() => setCurrentPollInterval(1)}>500ms</button>
                        <button className={currentPollInterval === 2 ? "Selected" : ""} onClick={() => setCurrentPollInterval(2)}>1s</button>
                        <button className={currentPollInterval === 3 ? "Selected" : ""} onClick={() => setCurrentPollInterval(3)}>2s</button>
                        <button className={currentPollInterval === 4 ? "Selected" : ""} onClick={() => setCurrentPollInterval(4)}>5s</button>
                        <button className={currentPollInterval === 5 ? "Selected" : ""} onClick={() => setCurrentPollInterval(5)}>10s</button>
                    </div>
                    <button onClick={() => setEditMode(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="Elements">
                {config.modules?.map(drawModules)}
            </div>

            {drawSubMenu()}
            {editMode &&
                <div className="PageEdit" onClick={() => setEditMode(false)}>
                    <PageEdit config={config} sessionId={sessionId} />
                </div>
            }
        </div >
    );
}