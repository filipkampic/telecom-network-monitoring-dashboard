import { useState } from "react";

export default function Filters({ onChange }: { onChange: (f: any) => void }) {
    const [deviceId, setDeviceId] = useState("");
    const [severity, setSeverity] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    function apply() {
        onChange({
            deviceId: deviceId || undefined,
            severity: severity || undefined,
            from: from || undefined,
            to: to || undefined
        });
    }

    return (
        <div style={{ margin: 20, display: "flex", gap: 10 }}>
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

            <button onClick={apply}>Apply</button>
        </div>
    );
}