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
    const [page, setPage] = useState(1);
    const pageSize = 20;
    
    async function loadData() {
        const [ev, st] = await Promise.all([
            getEvents(filters),
            getStats()
        ]);
        setEvents(ev);
        setStats(st);
        setPage(1);
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

    const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
    const start = (page - 1) * pageSize;
    const visibleEvents = events.slice(start, start + pageSize);

    function toggleSimulator() {
        const endpoint = simRunning ? "stop" : "start";

        fetch(`http://localhost:5102/api/simulator/${endpoint}`, {
            method: "POST"
        }).then(res => {
            if (res.ok) setSimRunning(!simRunning);
        });
    }

    return (
        <div className="dashboard-container">
            <h1 style={{ marginBottom: "24px" }}>Telecom Monitoring Dashboard</h1>

            <div className="card" style={{ display: "flex", justifyContent: "flex-start" }}>
                <button
                    className={`sim-btn ${simRunning ? "sim-stop" : "sim-start"}`}
                    onClick={toggleSimulator}
                >     
                    {simRunning ? "Stop Simulator" : "Start Simulator"}
                </button>
            </div>

            
            <div className="card">
                <Filters onChange={setFilters} />
            </div>

            <div className="card">
                <StatsPanel stats={stats} />
            </div>

            <div className="card">
                <EventsTable events={visibleEvents} />

                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    > 
                        Previous
                    </button>

                    <span>Page {page} / {totalPages}</span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    > 
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}