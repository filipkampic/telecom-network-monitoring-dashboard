using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelecomMonitor.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string DeviceId { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public string Message { get; set; } = default!;
        public DateTime Timestamp { get; set; }
    }
}
