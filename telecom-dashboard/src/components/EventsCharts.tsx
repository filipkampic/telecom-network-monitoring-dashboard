import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar,
    ResponsiveContainer
} from "recharts";
import type { Event } from "../types/Event";

type Stats = {
    errors: number;
    warnings: number;
    info: number;
}

export default function EventsCharts({ 
    events, stats 
}: { 
    events: Event[], 
    stats: Stats | null 
}) {
    const severityData = [
        { name: "Errors", value: events.filter(e => e.severity === "Error").length },
        { name: "Warnings", value: events.filter(e => e.severity === "Warning").length },
        { name: "Info", value: events.filter(e => e.severity === "Info").length }
    ];

    const COLORS = ["var(--error)", "var(--warning)", "var(--success)"];

    const eventsByDay = Object.values(
        events.reduce<Record<string, { day: string, count: number}>>(
            (acc, e) => {
                const day = new Date(e.timestamp).toISOString().split("T")[0];
                acc[day] = acc[day] || { day, count: 0 };
                acc[day].count++;
                return acc;
            }, 
            {}
        )
    );
    eventsByDay.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    const eventsByDevice = Object.values(
        events.reduce<Record<string, { device: string, count: number }>>(
            (acc, e) => {
                const device = e.deviceId;
                acc[device] = acc[device] || { device, count: 0 };
                acc[device].count++;
                return acc;
            }, 
            {}
        )
    );

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            <div className="card">
                <h3>Events by Severity</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={severityData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {severityData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3>Events Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart width={400} height={250} data={eventsByDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="day" 
                            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="var(--primary)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3>Events per Device</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart width={400} height={250} data={eventsByDevice}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="device" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--primary)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}