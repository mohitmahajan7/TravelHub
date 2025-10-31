import { useState } from 'react'
import './App.css'
import Sidebar from './components/common/Sidebar.jsx'
import Header from './components/common/Header.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import PendingApprovals from './components/approvals/PendingApprovals.jsx'
import Reimbursements from './components/reimbursements/Reimbursements.jsx'
import BudgetTracking from './components/budget/BudgetTracking.jsx'
import PolicyExceptions from './components/exceptions/PolicyExceptions.jsx'
import History from './components/history/History.jsx'
import Reports from './components/reports/Reports.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'pending-approvals':
        return <PendingApprovals />;
      case 'reimbursements':
        return <Reimbursements />;
      case 'budget-tracking':
        return <BudgetTracking />;
      case 'policy-exceptions':
        return <PolicyExceptions />;
      case 'history':
        return <History />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="App">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="main-content">
        <Header 
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App;