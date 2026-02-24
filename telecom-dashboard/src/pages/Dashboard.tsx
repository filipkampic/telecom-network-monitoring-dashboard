import { use, useEffect, useState } from 'react';
import { getEvents, getStats } from '../api/eventsApi';
import type { Event } from '../types/Event';
import EventsTable from '../components/EventsTable';
import StatsPanel from '../components/StatsPanel';
import Filters from '../components/Filters';

export default function Dashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [filters, setFilters] = useState({});
    const [simRunning, setSimRunning] = useState(false);
    
    async function loadData() {
        const [ev, st] = await Promise.all([
            getEvents(filters),
            getStats()
        ]);
        setEvents(ev);
        setStats(st);
    }

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [filters]);

    useEffect(() => {
        fetch("http://localhost:5102/api/simulator/status")
            .then(res => res.json())
            .then(data => setSimRunning(data.running));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Telecom Monitoring Dashboard</h1>
            <button
                onClick={() => {
                    const endpoint = simRunning
                    ? "stop"
                    : "start";

                    fetch(`http://localhost:5102/api/simulator/${endpoint}`, {
                    method: "POST"
                    })
                    .then(res => {
                        if (res.ok) setSimRunning(!simRunning);
                    });
                }}
                style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: simRunning ? "#d9534f" : "#5cb85c",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px"
                }}
                >
                {simRunning ? "Stop Simulator" : "Start Simulator"}
            </button>

            <Filters onChange={setFilters} />
            <StatsPanel stats={stats} />
            <EventsTable events={events} />
        </div>
    );
}