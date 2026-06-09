import { ReactNode } from "react";
import PollEventEmitter from "./PollEventEmitter";
import { Config, Config_Module } from "./config";

export interface GraphData<T extends GraphDataPoint> {
    series: GraphSeries[];
    data: T[],
}

export interface GraphSeries {
    fieldName: string;

    lineColour: string;
    areaColour: string;
}

export interface GraphDataPoint {
    time?: number,
}

export interface ModuleInput<T extends Config_Module> {
    pos: number,
    pollRate: number,

    config: T;
    sysInfo?: GlancesInfo;

    pollEmitter: PollEventEmitter;
    requestModal: (node: ReactNode | undefined) => void;
}



export interface GlancesInfo {
    processcount?: GlancesInfo_ProcessCount;
    percpu?: GlancesInfo_PerCpu[];
    cpu?: GlancesInfo_Cpu;
    uptime?: string;
    memswap?: GlancesInfo_MemSwap;
    fs?: GlancesInfo_FileSystem[];
    mem?: GlancesInfo_Mem;
    containers?: GlancesInfo_Docker[];
    diskio?: GlancesInfo_DiskIO[];
    network?: GlancesInfo_Network[];
    sensors?: GlancesInfo_Sensor[];
}

export interface GlancesInfo_ProcessCount {
    total?: number;
    running?: number;
    sleeping?: number;
    thread?: number;
    pid_max?: number;
}

export interface GlancesInfo_PerCpu {
    key?: string;
    cpu_number?: number;
    total?: number;
    user?: number;
    system?: number;
    idle?: number;
    nice?: number;
    iowait?: number;
    irq?: number;
    softirq?: number;
    steal?: number;
    guest?: number;
    guest_nice?: number;
    dpc?: any;
    interrupt?: any;
}

export interface GlancesInfo_Cpu {
    total?: number;
    user?: number;
    nice?: number;
    system?: number;
    idle?: number;
    iowait?: number;
    irq?: number;
    steal?: number;
    guest?: number;
    ctx_switches?: number;
    interrupts?: number;
    soft_interrupts?: number;
    syscalls?: number;
    cpucore?: number;
    time_since_update?: number;
    ctx_switches_gauge?: number;
    ctx_switches_rate_per_sec?: number;
    interrupts_gauge?: number;
    interrupts_rate_per_sec?: number;
    soft_interrupts_gauge?: number;
    soft_interrupts_rate_per_sec?: number;
    syscalls_gauge?: number;
    syscalls_rate_per_sec?: number;
}

export interface GlancesInfo_MemSwap {
    total?: number;
    used?: number;
    free?: number;
    percent?: number;
    sin?: number;
    sout?: number;
    time_since_update?: number;
}

export interface GlancesInfo_FileSystem {
    device_name?: string;
    fs_type?: string;
    mnt_point?: string;
    options?: string;
    size?: number;
    used?: number;
    free?: number;
    percent?: number;
    key?: string;
}

export interface GlancesInfo_Mem {
    total?: number;
    available?: number;
    percent?: number;
    used?: number;
    free?: number;
    active?: number;
    inactive?: number;
    buffers?: number;
    cached?: number;
    shared?: number;
    percent_min?: number;
    percent_max?: number;
    percent_mean?: number;
}


export interface GlancesInfo_Docker {
    key?: string;
    name?: string;
    id?: string;
    status?: string;
    created?: string;
    command?: string;
    io?: GlancesInfo_Docker_IO;
    cpu?: GlancesInfo_Docker_Cpu;
    memory?: GlancesInfo_Docker_Memory;
    network?: GlancesInfo_Docker_Network;
    io_rx?: number;
    io_wx?: number;
    cpu_percentage?: number;
    memory_percent?: number;
    ports?: string;
    uptime?: string;
    image?: string[];
    memory_usage?: number;
    memory_inactive_file?: number;
    memory_limit?: number;
    engine?: string;
}
export interface GlancesInfo_Docker_IO {
    cumulative_ior?: number;
    cumulative_iow?: number;
    time_since_update?: number;
    ior?: number;
    iow?: number;
}
export interface GlancesInfo_Docker_Cpu {
    total?: number;
}
export interface GlancesInfo_Docker_Memory {
    usage?: number;
    limit?: number;
    inactive_file?: number;
}
export interface GlancesInfo_Docker_Network {
    cumulative_rx?: number;
    cumulative_tx?: number;
    time_since_update?: number;
    rx?: number;
    tx?: number;
}

export interface GlancesInfo_DiskIO {
    read_count?: number;
    write_count?: number;
    read_bytes?: number;
    write_bytes?: number;
    read_time?: number;
    write_time?: number;
    key?: string;
    disk_name?: string;
    time_since_update?: number;
    read_count_gauge?: number;
    read_count_rate_per_sec?: number;
    write_count_gauge?: number;
    write_count_rate_per_sec?: number;
    read_bytes_gauge?: number;
    read_bytes_rate_per_sec?: number;
    write_bytes_gauge?: number;
    write_bytes_rate_per_sec?: number;
    read_time_gauge?: number;
    read_time_rate_per_sec?: number;
    write_time_gauge?: number;
    write_time_rate_per_sec?: number;
    read_latency?: number;
    write_latency?: number;
}

export interface GlancesInfo_Network {
    bytes_sent?: number;
    bytes_recv?: number;
    speed?: number;
    key?: string;
    interface_name?: string;
    alias?: string;
    bytes_all?: number;
    time_since_update?: number;
    bytes_recv_gauge?: number;
    bytes_recv_rate_per_sec?: number;
    bytes_sent_gauge?: number;
    bytes_sent_rate_per_sec?: number;
    bytes_all_gauge?: number;
    bytes_all_rate_per_sec?: number;
}

export interface GlancesInfo_Sensor {
    label?: string;
    unit?: string;
    value?: number;
    warning?: number;
    critical?: number;
    type?: string;
    key?: string;
}