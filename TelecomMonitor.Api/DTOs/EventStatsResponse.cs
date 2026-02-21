namespace TelecomMonitor.Api.DTOs
{
    public class EventStatsResponse
    {
        public int TotalEvents { get; set; }
        public int Error { get; set; }
        public int Warnings { get; set; }
        public int Info { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
}
