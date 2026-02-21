namespace TelecomMonitor.Api.DTOs
{
    public class CreateEventRequest
    {
        public string DeviceId { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public string Message { get; set; } = default!;
        public DateTime Timestamp { get; set; }
    }
}
