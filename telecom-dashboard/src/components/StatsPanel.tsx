export default function StatsPanel({ stats }: { stats: any }) {
    if (!stats) return null;

    return(
        <div className="stats-grid">
            <div className="stat-box">
                <div className="stat-label">Total Events</div>
                <div className="stat-value">
                    {stats.errors + stats.warnings + stats.info}
                </div>
            </div>
            <div className="stat-box">
                <div className="stat-label">Errors</div>
                <div className="stat-value" style={{color: "var(--error)"}}>{stats.errors}</div>
            </div>
            <div className="stat-box">
                <div className="stat-label">Warnings</div>
                <div className="stat-value" style={{color: "var(--warning)"}}>{stats.warnings}</div>
            </div>
            <div className="stat-box">
                <div className="stat-label">Info</div>
                <div className="stat-value" style={{color: "var(--success)"}}>{stats.info}</div>
            </div>
        </div>
    );
}