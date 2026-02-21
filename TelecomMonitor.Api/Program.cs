using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TelecomMonitor.Api.DTOs;
using TelecomMonitor.Api.Validators;
using TelecomMonitor.Domain.Entities;
using TelecomMonitor.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddValidatorsFromAssemblyContaining<CreateEventRequestValidator>();

var app = builder.Build();

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
    AppDbContext db
) =>
{
    var validation = await validator.ValidateAsync(request);
    if (!validation.IsValid)
    {
        return Results.BadRequest(validation.Errors);
    }

    var entity = new Event
    {
        DeviceId = request.DeviceId,
        Severity = request.Severity,
        Message = request.Message,
        Timestamp = request.Timestamp
    };

    db.Events.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/api/events/{entity.Id}", entity.Id);
});

// GET /api/events
app.MapGet("/api/events", async (AppDbContext db) =>
{
    var events = await db.Events
        .OrderByDescending(e => e.Timestamp)
        .Select(e => new EventResponse
        {
            Id = e.Id,
            DeviceId = e.DeviceId,
            Severity = e.Severity,
            Message = e.Message,
            Timestamp = e.Timestamp
        })
        .ToListAsync();

    return Results.Ok(events);
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


app.Run();
