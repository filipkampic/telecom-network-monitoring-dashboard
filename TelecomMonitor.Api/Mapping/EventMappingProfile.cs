using AutoMapper;
using TelecomMonitor.Api.DTOs;
using TelecomMonitor.Domain.Entities;

namespace TelecomMonitor.Api.Mapping
{
    public class EventMappingProfile : Profile
    {
        public EventMappingProfile() {

            CreateMap<Event, EventResponse>();
            CreateMap<CreateEventRequest, Event>();
        }
    }
}
