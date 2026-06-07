import { bytesToGiB } from "../shared/helperFunctions";
import { GlancesInfo_FileSystem } from "../shared/types";

import "./storageComponent.css"

export default function ({ fs }: { fs: GlancesInfo_FileSystem[] }) {

    return (<div className="Component_Storage">
        {
            fs.map(f =>
                <div key={f.mnt_point} className="Component_Storage_Element">
                    <span style={{ textAlign: "left" }}>
                        {f.mnt_point}
                    </span>
                    <div>
                        <div style={{ width: `${f.percent}%` }} />
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