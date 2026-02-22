using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelecomMonitor.Simulator.Models
{
    public class CreateEventRequest
    {
        public string DeviceId { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public string Message { get; set; } = default!;
        public DateTime Timestamp { get; set; }
    }
}
