const API_URL = "http://localhost:5102/api/events";

export async function getEvents(params?: {
    deviceId?: string;
    severity?: string;
    from?: string;
    to?: string;
}) {
    const clean = Object.fromEntries(
        Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
    )
    const query = new URLSearchParams(clean).toString();
    const res = await fetch(`${API_URL}?${query}`);
    return res.json();
}

export async function getStats() {
    const res = await fetch("http://localhost:5102/api/events/stats");
    return res.json();
}
