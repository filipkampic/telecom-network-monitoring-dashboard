import type { Event } from "../types/Event";

export function getMostRecentEvent(deviceEvents: Event[]): Event {
    return deviceEvents.reduce((latest, e) => 
        new Date(e.timestamp) > new Date(latest.timestamp) ? e : latest
    );
}