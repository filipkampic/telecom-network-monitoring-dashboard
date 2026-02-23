export default function StatsPanel({ stats }: { stats: any }) {
    if (!stats) return null;

    return(
        <div style={{ margin: "20px 0" }}>
            <h2>Stats</h2>
            <p>Total events: {stats.totalEvents}</p>
            <p>Errors: {stats.errors}</p>
            <p>Warnings: {stats.warnings}</p>
            <p>Info: {stats.info}</p>
        </div>
    );
}