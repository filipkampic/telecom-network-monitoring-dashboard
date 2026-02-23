import type { Event } from "../types/Event";

export default function EventsTable({ events }: { events: Event[] }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Device</th>
                    <th>Severity</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {events.map(e => (
                    <tr key={e.id}>
                        <td>{e.deviceId}</td>
                        <td>{e.severity}</td>
                        <td>{e.message}</td>
                        <td>{new Date(e.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}