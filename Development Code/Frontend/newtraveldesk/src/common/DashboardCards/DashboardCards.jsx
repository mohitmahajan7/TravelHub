import React from 'react';
import './DashboardCards.css';

const DashboardCards = ({ counts, onCardClick }) => {
  const cards = [
    {
      id: 'validationQueue',
      title: 'Pending Validation',
    //   value: counts.pending,
      footer: 'Tickets awaiting validation',
      icon: 'fas fa-clock',
      type: 'pending'
    },
    {
      id: 'bookingQueue',
      title: 'Awaiting Booking',
    //   value: counts.booking,
      footer: 'Ready for booking',
      icon: 'fas fa-check-circle',
      type: 'validation'
    },
    {
      id: 'exceptions',
      title: 'Policy Exceptions',
    //   value: counts.exception,
      footer: 'Requiring attention',
      icon: 'fas fa-exclamation-circle',
      type: 'exception'
    },
    {
      id: 'bookingHistory',
      title: 'Booked Today',
    //   value: counts.booked,
      footer: 'Successfully booked',
      icon: 'fas fa-plane-departure',
      type: 'booking'
    }
  ];

  return (
    <div className="dashboard-cards">
      {cards.map(card => (
        <div key={card.id} className="card" onClick={() => onCardClick(card.id)}>
          <div className="card-header">
            <div className="card-title">{card.title}</div>
            <div className={`card-icon ${card.type}`}>
              <i className={card.icon}></i>
            </div>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-footer">{card.footer}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;