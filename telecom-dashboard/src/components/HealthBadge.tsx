export function HealthBadge({ online }: { online: boolean | null }) {
    if (online === null) {
        return <span style={badgeStyle("#888")}>● Checking…</span>;
    }

    return (
        <span style={badgeStyle(online ? "#22c55e" : "#ef4444")}>
            {online ? "● Backend online" : "● Backend offline"}
        </span>
    );
}

function badgeStyle(color: string): React.CSSProperties {
    return {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "0.8rem",
        fontWeight: 600,
        color,
        background: `${color}18`,
        border: `1px solid ${color}55`,
        borderRadius: "999px",
        padding: "4px 12px",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        transition: "color 0.3s, background 0.3s, border-color 0.3s",
    };
}
