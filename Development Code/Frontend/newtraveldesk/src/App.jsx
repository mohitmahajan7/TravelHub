import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './common/Sidebar/Sidebar.jsx'
import Header from './common/Header/Header.jsx'
import DashboardCards from './common/DashboardCards/DashboardCards.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import ValidationQueue from './ValidationQueue/ValidationQueue.jsx'
import BookingQueue from './BookingQueue/BookingQueue.jsx'
import Exceptions from './Exceptions/Exceptions.jsx'
import BookingHistory from './BookingHistory/BookingHistory.jsx'
import Reports from './Reports/Reports.jsx'
import TravelBookingPopup from './common/TravelBookingPopup/TravelBookingPopup.jsx'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showTravelPopup, setShowTravelPopup] = useState(false);
  const [count, setCount] = useState(0)

  // Function to handle section changes from Sidebar
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Function to render the active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'validationQueue':
        return <ValidationQueue />;
      case 'bookingQueue':
        return <BookingQueue />;
      case 'exceptions':
        return <Exceptions />;
      case 'bookingHistory':
        return <BookingHistory />;
      case 'reports':
        return <Reports />;
      case 'helpandsupport':
        return <div className="help-support-page">Help & Support Page - Content coming soon</div>;
      default:
        return <Dashboard />;
    }
  };  

  // Handle confirm booking from popup
  const handleConfirmBooking = (bookingData) => {
    console.log('Booking confirmed:', bookingData);
    alert('Booking confirmed successfully!');
    setShowTravelPopup(false);
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <div className="main-content">
        <Header />
        <div className="content-area">
          {renderActiveSection()}
        </div>
      </div>

      {/* Temporary button for Travel Booking Popup */}
      {/* <button 
        className="temp-popup-btn"
        onClick={() => setShowTravelPopup(true)}
      >
        Test Travel Popup
      </button> */}

      {/* Travel Booking Popup */}
      <TravelBookingPopup
        isOpen={showTravelPopup}
        onClose={() => setShowTravelPopup(false)}
        onConfirmBooking={handleConfirmBooking}
        travelRequest={{
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
        }}
      />
    </div>
  )
}

export default App;