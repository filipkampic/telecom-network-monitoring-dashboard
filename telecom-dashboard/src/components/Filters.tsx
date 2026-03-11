import { useState } from "react";

export default function Filters({ onChange }: { onChange: (f: any) => void }) {
    const [deviceId, setDeviceId] = useState("");
    const [severity, setSeverity] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    function apply() {
        onChange({
            deviceId: deviceId.trim().toLowerCase() || undefined,
            severity: severity || undefined,
            from: from || undefined,
            to: to || undefined
        });
    }

    return (
        <div className="filters">
            <input
                placeholder="Device ID"
                value={deviceId}
                onChange={e => setDeviceId(e.target.value)}
            />

            <select value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="">All Severities</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
            </select>

            <input
                 type="datetime-local"
                value={from}
                onChange={e => setFrom(e.target.value)}
            />

            <input
                type="datetime-local"
                value={to}
                onChange={e => setTo(e.target.value)}
             />

            <div className="filters-actions"> 
                <button className="btn-primary" onClick={apply}>Apply</button>

                <button className="btn-secondary" onClick={() => {
                    setDeviceId("");
                    setSeverity("");
                    setFrom("");
                    setTo("");
                    onChange({});
                }}>
                    Clear
                </button>
            </div>
        </div>
    );
}