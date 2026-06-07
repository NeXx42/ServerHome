import { exportPages } from "next/dist/export/worker";

export interface GraphData {
    time: number;
    relativeTime: number;

    value: string,
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
