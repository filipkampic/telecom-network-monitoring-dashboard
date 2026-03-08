import type { Event } from "../types/Event";

export function getDeviceStatus(eventsForDevice: Event[]) {
    if (eventsForDevice.length === 0) return "online";

    const sorted = [...eventsForDevice].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const latest = sorted[sorted.length - 1];
    const severity = latest.severity.toLowerCase();

    if (severity === "critical" || severity === "error") return "offline";
    if (severity === "warning") return "warning";
    return "online";
}