import { bytesToGiB } from "../shared/helperFunctions";
import { GlancesInfo_FileSystem } from "../shared/types";

import "./storageComponent.css"

const StorageColouring = [
    {
        endPercentage: 66,
        colour: "#22c55e"
    },
    {
        endPercentage: 80,
        colour: "#f59e0b"
    },
    {
        endPercentage: 1000,
        colour: "#ef4444"
    }
]

export default function ({ fs }: { fs: GlancesInfo_FileSystem[] }) {
    return (<div className="Component_Storage">
        {
            fs.map(f =>
                <div key={f.mnt_point} className="Component_Storage_Element">
                    <span style={{ textAlign: "left" }}>
                        {f.mnt_point}
                    </span>
                    <div>
                        <div style={{ width: `${f.percent}%`, backgroundColor: StorageColouring.find(x => (f?.percent ?? 0) < x.endPercentage)?.colour }} />
                    </div>
                    <span>
                        {`${f.percent?.toFixed(0)}%`}
                    </span>
                    <span>
                        {`${bytesToGiB(f.size ?? 0)}GB`}
                    </span>
                </div>
            )
        }
    </div>)
}