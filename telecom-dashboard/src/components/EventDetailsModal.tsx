import "../Modal.css";
import type { Event } from "../types/Event";
import { getSeverityColor } from "../utils/getSeverityColor";

interface Props {
    event: Event;
    onClose: () => void;
}

export default function EventDetailsModal({ event, onClose }: Props) {
    const sevColor = getSeverityColor(event.severity);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Event Details</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        &#x2715;
                    </button>
                </div>

                <div className="modal-field">
                    <span className="modal-label">Device</span>
                    <span className="modal-value">{event.deviceId}</span>
                </div>

                <div className="modal-field">
                    <span className="modal-label">Severity</span>
                    <span className="modal-severity-badge" style={{
                        color: sevColor,
                        background: `${sevColor}22`,
                        border: `1px solid ${sevColor}66`,
                    }}>
                        {event.severity}
                    </span>
                </div>

                <div className="modal-field">
                    <span className="modal-label">Timestamp</span>
                    <span className="modal-value">{new Date(event.timestamp).toLocaleString()}</span>
                </div>

                <div className="modal-field">
                    <span className="modal-label">ID</span>
                    <span className="modal-value">{event.id}</span>
                </div>

                <div className="modal-field modal-field--last">
                    <span className="modal-label">Message</span>
                    <span className="modal-value">{event.message}</span>
                </div>
            </div>
        </div>
    );
}