import { useEffect, useState, useRef } from 'react';
import { getEvents, getStats } from '../api/eventsApi';
import type { Event } from '../types/Event';
import EventsTable from '../components/EventsTable';
import StatsPanel from '../components/StatsPanel';
import Filters from '../components/Filters';
import EventsCharts from '../components/EventsCharts';
import { DeviceStatusList } from '../components/DeviceStatusList';
import { HealthBadge } from "../components/HealthBadge";
import { useHealthCheck } from '../hooks/useHealthCheck';
import * as signalR from "@microsoft/signalr";
import EventDetailsModal from '../components/EventDetailsModal';

type Stats = {
    totalEvents: number;
    errors: number;
    warnings: number;
    info: number;
    generatedAt: string;
};

export default function Dashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [filters, setFilters] = useState({});
    const [simRunning, setSimRunning] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const pageRef = useRef(page);
    const filtersRef = useRef(filters);
    const pageSize = 20;
    const { online } = useHealthCheck(5000);
    
    async function loadData() {
        setLoading(true);

        const [ev, st] = await Promise.all([
            getEvents(filters),
            getStats()
        ]);

        setEvents(ev);
        setStats(st);
        setPage(1);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [filters]);

    useEffect(() => {
        fetch("http://localhost:5102/api/simulator/status")
            .then(res => res.json())
            .then(data => setSimRunning(data.running));
    }, []);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    function checkFilters(event: Event, filters: any) {
        if (!filters || Object.keys(filters).length === 0) return true;
        
        if (filters.deviceId && event.deviceId !== filters.deviceId)
            return false;

        if (filters.severity && event.severity !== filters.severity)
            return false;

        if (filters.from && new Date(event.timestamp) < new Date(filters.from))
            return false;

        if (filters.to && new Date(event.timestamp) > new Date(filters.to))
            return false;

        return true;
    }

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5102/eventsHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                setConnected(true);
            })
            .catch(() => {
                setConnected(false);
            });

        connection.on("NewEvent", (raw: any) => {
            const newEvent: Event = {
                id: raw.id ?? raw.Id,
                deviceId: raw.deviceId ?? raw.DeviceId,
                severity: raw.severity ?? raw.Severity,
                message: raw.message ?? raw.Message,
                timestamp: raw.timestamp ?? raw.Timestamp,
            };

            if (pageRef.current === 1 && checkFilters(newEvent, filtersRef.current)) {
                setEvents(prev => [newEvent, ...prev]);
            }

            setStats(prev => {
                if (!prev) return prev;

                return {
                    totalEvents: prev.totalEvents + 1,
                    errors: prev.errors + (newEvent.severity === "Error" ? 1 : 0),
                    warnings: prev.warnings + (newEvent.severity === "Warning" ? 1 : 0),
                    info: prev.info + (newEvent.severity === "Info" ? 1 : 0),
                    generatedAt: new Date().toISOString()
                };
            });
        });

        return () => {
            connection.stop();
        };
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

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Telecom Monitoring Dashboard</h1>
                    <HealthBadge online={online} />
                </div>
                <div className="card">Loading…</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            <div className="dashboard-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Telecom Monitoring Dashboard</h1>
                <HealthBadge online={online} />
            </div>

            <div className="card" style={{ display: "flex", justifyContent: "flex-start" }}>
                <button
                    className={`sim-btn ${simRunning ? "sim-stop" : "sim-start"}`}
                    onClick={toggleSimulator}
                >     
                    {simRunning ? "Stop Simulator" : "Start Simulator"}
                </button>
            </div>

            <div className="dashboard-content">
        
                <div className="card two-column">
                    <div className="filters-column">
                        <Filters onChange={setFilters} />
                    </div>

                    <div className="device-column">
                        <DeviceStatusList events={events} />
                    </div>
                </div>

                <div className="card">
                    {stats ? <StatsPanel stats={stats} /> : <p>Loading stats…</p>}
                </div>

                <div className="card">
                    {events.length === 0
                        ? <p>No chart data</p>
                        : <EventsCharts events={events} />
                    }
                </div>

                <div className="card">
                    {events.length === 0
                        ? <p>No events yet</p>
                        : <EventsTable events={visibleEvents} onSelect={setSelectedEvent} />
                    }

                    {events.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}
