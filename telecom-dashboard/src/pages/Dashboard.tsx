import { useEffect, useState } from 'react';
import { getEvents, getStats } from '../api/eventsApi';
import type { Event } from '../types/Event';
import EventsTable from '../components/EventsTable';
import StatsPanel from '../components/StatsPanel';
import Filters from '../components/Filters';

export default function Dashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [filters, setFilters] = useState({});

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

    return (
        <div style={{ padding: 20 }}>
            <h1>Telecom Monitoring Dashboard</h1>
            <Filters onChange={setFilters} />
            <StatsPanel stats={stats} />
            <EventsTable events={events} />
        </div>
    );
}