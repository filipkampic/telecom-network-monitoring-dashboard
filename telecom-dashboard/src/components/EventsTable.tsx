import type { Event } from "../types/Event";

interface Props {
    events: Event[];
    onSelect: (event: Event) => void;
}

export default function EventsTable({ events, onSelect }: Props) {
    return (
        <div className="table-container">
            <table className="events-table">
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
                        <tr 
                            key={e.id}
                            onClick={() => onSelect(e)}
                            className="events-table-row"
                            style={{ cursor: "pointer" }}
                        >
                            <td>{e.deviceId}</td>
                            <td className={`severity-${e.severity.toLowerCase()}`}>{e.severity}</td>
                            <td>{e.message}</td>
                            <td>{new Date(e.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}