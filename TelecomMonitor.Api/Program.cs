using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using TelecomMonitor.Api.DTOs;
using TelecomMonitor.Api.Mapping;
using TelecomMonitor.Api.Validators;
using TelecomMonitor.Domain.Entities;
using TelecomMonitor.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.MigrationsAssembly("TelecomMonitor.Infrastructure")
    )
);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddValidatorsFromAssemblyContaining<CreateEventRequestValidator>();
builder.Services.AddAutoMapper(typeof(EventMappingProfile));

var app = builder.Build();
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// POST /api/events
app.MapPost("/api/events", async (
    CreateEventRequest request,
    IValidator<CreateEventRequest> validator,
    AppDbContext db,
    IMapper mapper
) =>
{
    var validation = await validator.ValidateAsync(request);
    if (!validation.IsValid)
    {
        return Results.BadRequest(validation.Errors);
    }

    var entity = mapper.Map<Event>(request);

    db.Events.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/api/events/{entity.Id}", entity.Id);
});

// GET /api/events
/// <summary>
/// Returns events with optional filtering.
/// </summary>
app.MapGet("/api/events", async (
    AppDbContext db,
    IMapper mapper,
    string? deviceId,
    string? severity,
    DateTime? from,
    DateTime? to
) =>
{
    var query = db.Events.AsQueryable();

    if (!string.IsNullOrWhiteSpace(deviceId)) {
        query = query.Where(e => e.DeviceId == deviceId);
    }

    if (!string.IsNullOrWhiteSpace(severity)) {
        query = query.Where(e => e.Severity == severity);
    }

    if (from.HasValue) {
        query = query.Where(e => e.Timestamp >= from.Value);
    }

    if (to.HasValue) {
        query = query.Where(e => e.Timestamp <= to.Value);
    }

    var events = await query
        .OrderByDescending(e => e.Timestamp)
        .ToListAsync();

    var response = mapper.Map<List<EventResponse>>(events);

    return Results.Ok(response);
});

// GET /api/events/stats
app.MapGet("/api/events/stats", async (AppDbContext db) =>
{
    var total = await db.Events.CountAsync();
    var errors = await db.Events.CountAsync(e => e.Severity == "Error");
    var warnings = await db.Events.CountAsync(e => e.Severity == "Warning");
    var info = await db.Events.CountAsync(e => e.Severity == "Info");

    var stats = new EventStatsResponse
    {
        TotalEvents = total,
        Errors = errors,
        Warnings = warnings,
        Info = info,
        GeneratedAt = DateTime.UtcNow
    };

    return Results.Ok(stats);
});

Process? simulatorProcess = null;

app.MapPost("/api/simulator/start", () => 
{
    if (simulatorProcess != null && !simulatorProcess.HasExited)
        return Results.Ok("Already running.");

    var psi = new ProcessStartInfo
    {
        FileName = "dotnet",
        Arguments = "run --project TelecomMonitor.Simulator",
        WorkingDirectory = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = false
    };

    simulatorProcess = Process.Start(psi);

    if (simulatorProcess == null)
        return Results.Problem("Failed to start simulator process.");

    simulatorProcess.OutputDataReceived += (_, e) => Console.WriteLine(e.Data);
    simulatorProcess.ErrorDataReceived += (_, e) => Console.WriteLine("ERR: " + e.Data);

    simulatorProcess.BeginOutputReadLine();
    simulatorProcess.BeginErrorReadLine();

    return Results.Ok("Simulator started.");
});

app.MapPost("/api/simulator/stop", () =>
{
    if (simulatorProcess != null && !simulatorProcess.HasExited)
    {
        simulatorProcess.Kill();
        simulatorProcess = null;
        return Results.Ok("Simulator stopped.");
    }

    return Results.Ok("Simulator was not running.");
});

app.MapGet("/api/simulator/status", () =>
{
    return simulatorProcess != null && !simulatorProcess.HasExited
        ? Results.Ok(new { running = true })
        : Results.Ok(new { running = false });
});

app.Run();
