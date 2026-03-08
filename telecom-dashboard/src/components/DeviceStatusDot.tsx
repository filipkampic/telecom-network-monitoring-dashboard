export function DeviceStatusDot({ status }: { status: "online" | "warning" | "offline" }) {
    const color = 
        status === "online" ? "var(--success)" :
        status === "warning" ? "var(--warning)" :
        "var(--error)";
    
    return (
        <span
            style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: "8px"
            }}
        />
    );
}