using System.Net.Http.Json;
using TelecomMonitor.Simulator.Models;

var client = new HttpClient
{
    BaseAddress = new Uri("http://localhost:5102")
};

var random = new Random();

string[] deviceIds = { "BS-101", "BS-102", "BS-103", "BS-201", "BS-202", "BS-203", "BS-301", "BS-302", "BS-303" };
string[] severities = { "Info", "Warning", "Error" };
string[] messages =
{
    "Signal drop detected",
    "High latency observed",
    "Packet loss detected",
    "Device rebooted",
    "Connection restored"
};

Console.WriteLine("Simulator started. Press CTRL+C to stop.");

while (true)
{
    var evt = new CreateEventRequest
    {
        DeviceId = deviceIds[random.Next(deviceIds.Length)],
        Severity = severities[random.Next(severities.Length)],
        Message = messages[random.Next(messages.Length)],
        Timestamp = DateTime.UtcNow
    };

    var response = await client.PostAsJsonAsync("/api/events", evt);

    if (response.IsSuccessStatusCode)
    {
        Console.WriteLine($"Sent: {evt.DeviceId} | {evt.Severity} | {evt.Message}");
    } else
    {
        Console.WriteLine($"Failed: {response.StatusCode}");
    }

    await Task.Delay(5000);
}
