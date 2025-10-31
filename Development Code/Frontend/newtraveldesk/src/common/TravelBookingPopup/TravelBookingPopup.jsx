import React, { useState } from 'react';
import './TravelBookingPopup.css';

const TravelBookingPopup = ({ isOpen, onClose, travelRequest, onConfirmBooking }) => {
  const [remarks, setRemarks] = useState('');
  const [bookingActions, setBookingActions] = useState({
    flightTicket: false,
    hotelReservation: false,
    foodAllowance: false,
    localCommute: false,
    documentation: false
  });

  if (!isOpen) return null;

  const handleCheckboxChange = (action) => {
    setBookingActions(prev => ({
      ...prev,
      [action]: !prev[action]
    }));
  };

  const handleConfirmBooking = () => {
    if (onConfirmBooking) {
      onConfirmBooking({
        ...travelRequest,
        remarks,
        bookingActions
      });
    }
  };

  const allActionsCompleted = Object.values(bookingActions).every(action => action);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Header */}
        <div className="popup-header">
          <h2>Travel Desk - Booking Action</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Employee Information */}
        <div className="section">
          <h3 className="section-title">Employee Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{travelRequest.employeeName} ({travelRequest.employeeId})</span>
            </div>
            <div className="info-item">
              <label>Department:</label>
              <span>{travelRequest.department}</span>
            </div>
            <div className="info-item">
              <label>Travel Purpose:</label>
              <span>{travelRequest.purpose}</span>
            </div>
          </div>
        </div>

        {/* Request Ticket Journey */}
        <div className="section">
          <h3 className="section-title">Request Ticket Journey</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Ticket ID:</label>
              <span className="ticket-id">{travelRequest.ticketId}</span>
            </div>
            <div className="info-item">
              <label>Route:</label>
              <span>{travelRequest.from} → {travelRequest.to}</span>
            </div>
            <div className="info-item">
              <label>Travel Dates:</label>
              <span>{travelRequest.startDate} - {travelRequest.endDate}</span>
            </div>
            <div className="info-item">
              <label>Mode:</label>
              <span>{travelRequest.modeOfTravel}</span>
            </div>
            <div className="info-item">
              <label>Accommodation:</label>
              <span>{travelRequest.accommodation}</span>
            </div>
          </div>
        </div>

        {/* Travel Desk Actions */}
        <div className="section">
          <h3 className="section-title">Travel Desk Actions</h3>
          
          {/* Validation Status */}
          <div className="validation-status approved">
            <span className="status-icon">✅</span>
            <span className="status-text">Approved - Proceed to Booking</span>
          </div>

          {/* Remarks */}
          <div className="remarks-section">
            <label htmlFor="remarks" className="remarks-label">Remarks / Justification</label>
            <textarea
              id="remarks"
              className="remarks-textarea"
              placeholder="Add any specific notes or instructions for booking..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="3"
            />
          </div>

          {/* Booking Actions */}
          <div className="booking-actions-section">
            <h4>Booking Actions</h4>
            <div className="checklist">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={bookingActions.flightTicket}
                  onChange={() => handleCheckboxChange('flightTicket')}
                />
                <span>Flight Ticket Booking</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={bookingActions.hotelReservation}
                  onChange={() => handleCheckboxChange('hotelReservation')}
                />
                <span>Hotel Reservation</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={bookingActions.foodAllowance}
                  onChange={() => handleCheckboxChange('foodAllowance')}
                />
                <span>Food Allowance Processed</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={bookingActions.localCommute}
                  onChange={() => handleCheckboxChange('localCommute')}
                />
                <span>Local Commute Arranged</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={bookingActions.documentation}
                  onChange={() => handleCheckboxChange('documentation')}
                />
                <span>Documentation Completed</span>
              </label>
            </div>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="confirmation-section">
          <button
            className={`confirm-btn ${allActionsCompleted ? 'enabled' : 'disabled'}`}
            onClick={handleConfirmBooking}
            disabled={!allActionsCompleted}
          >
            CONFIRM BOOKING
          </button>
          {!allActionsCompleted && (
            <p className="completion-warning">
              Please complete all booking actions before confirming.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Default props
TravelBookingPopup.defaultProps = {
  travelRequest: {
    employeeName: "Neha Gupta",
    employeeId: "E10239",
    department: "Finance",
    purpose: "Audit Meeting",
    ticketId: "#TT-2023-0881",
    from: "Mumbai",
    to: "Pune",
    startDate: "25 Sep 2023",
    endDate: "27 Sep 2023",
    modeOfTravel: "Flight",
    accommodation: "Hotel (2 nights)"
  }
};

export default TravelBookingPopup;