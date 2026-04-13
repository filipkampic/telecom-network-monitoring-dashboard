import { useEffect, useState } from "react";
import { DeviceStatusDot } from "./DeviceStatusDot";
import { getDeviceStatus } from "../utils/getDeviceStatus";
import { getMostRecentEvent } from "../utils/getMostRecentEvent";
import { getSeverityColor } from "../utils/getSeverityColor";
import { getTimeAgo } from "../utils/getTimeAgo";
import type { Event } from "../types/Event";

export function DeviceStatusList({ events }: { events: Event[] }) {

    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    });

    const devices = events.reduce<Record<string, Event[]>>((acc, e) => {
        acc[e.deviceId] = acc[e.deviceId] || [];
        acc[e.deviceId].push(e);
        return acc;
    }, {});

    const deviceEntries = Object.entries(devices);

     if (deviceEntries.length === 0) {
        return (
            <div className="card">
                <h3>Device Status</h3>
                <p style={{ color: "var(--text-muted, #9ca3af)", fontSize: "0.85rem" }}>
                    No devices yet.
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Device Status</h3>
            <ul className="device-list">
                {deviceEntries.map(([device, deviceEvents]) => {
                    const status = getDeviceStatus(deviceEvents);
                    const lastEvent = getMostRecentEvent(deviceEvents)
                    const timeAgo = getTimeAgo(lastEvent.timestamp);
                    const sevColor = getSeverityColor(lastEvent.severity);

                    return (
                        <li
                            key={device}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 4px",
                                borderBottom: "1px solid var(--border, #e5e7eb)",
                            }}
                        >
                            <DeviceStatusDot status={status} />
 
                            <span style={{ fontWeight: 600, minWidth: "80px", fontSize: "0.9rem" }}>
                                {device}
                            </span>
 
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: sevColor,
                                background: `${sevColor}18`,
                                border: `1px solid ${sevColor}44`,
                                borderRadius: "999px",
                                padding: "2px 8px",
                                whiteSpace: "nowrap",
                            }}>
                                {lastEvent.severity || "None"}
                            </span>
 
                            <span style={{
                                flex: 1,
                                fontSize: "0.8rem",
                                color: "var(--text-muted, #6b7280)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                                title={lastEvent.message}
                            >
                                {lastEvent.message}
                            </span>
 
                            <span style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted, #9ca3af)",
                                whiteSpace: "nowrap",
                                marginLeft: "auto",
                            }}>
                                {timeAgo}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}