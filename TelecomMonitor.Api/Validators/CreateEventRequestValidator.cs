using FluentValidation;
using TelecomMonitor.Api.DTOs;

namespace TelecomMonitor.Api.Validators
{
    public class CreateEventRequestValidator : AbstractValidator<CreateEventRequest>
    {
        public CreateEventRequestValidator() {

            RuleFor(x => x.DeviceId)
                .NotEmpty().WithMessage("DeviceId is required.");

            RuleFor(x => x.Severity)
                .NotEmpty().WithMessage("Severity is required.")
                .Must(s => new[] { "Info", "Warning", "Error" }.Contains(s)).WithMessage("Severity must be Info, Warning, or Error.");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Message is required.");

            RuleFor(x => x.Timestamp)
                .LessThanOrEqualTo(DateTime.UtcNow.AddMinutes(1)).WithMessage("Timestamp cannot be in the future.");
        }
    }
}
