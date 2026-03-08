import { DeviceStatusDot } from "./DeviceStatusDot";
import { getDeviceStatus } from "../utils/getDeviceStatus";
import type { Event } from "../types/Event";

export function DeviceStatusList({ events }: { events: Event[] }) {
    const devices = events.reduce<Record<string, Event[]>>((acc, e) => {
        acc[e.deviceId] = acc[e.deviceId] || [];
        acc[e.deviceId].push(e);
        return acc;
    }, {});

    const deviceEntries = Object.entries(devices);

    return (
        <div className="card">
            <h3>Device Status</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0} }>
                {deviceEntries.map(([device, deviceEvents]) => {
                    const status = getDeviceStatus(deviceEvents);
                    return (
                        <li key={device} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                            <DeviceStatusDot status={status} />
                            <span>{device}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}