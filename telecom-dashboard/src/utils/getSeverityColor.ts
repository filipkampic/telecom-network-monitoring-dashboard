export function getSeverityColor(severity: string): string {
    switch (severity) {
        case "Error":   return "#ef4444";
        case "Warning": return "#f59e0b";
        case "Info":    return "#22c55e";
        default:        return "#9ca3af";
    }
}

