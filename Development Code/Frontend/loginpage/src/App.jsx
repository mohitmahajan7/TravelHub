import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Loginpage from '../src/components/loginpage'
import './App.css' // if you have this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Loginpage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Add these internal dashboard routes for non-admin users */}
        {/* <Route path="/manager-dashboard" element={<div>Manager Dashboard - Coming Soon</div>} />
        <Route path="/hr-dashboard" element={<div>HR Dashboard - Coming Soon</div>} />
        <Route path="/employee-dashboard" element={<div>Employee Dashboard - Coming Soon</div>} /> */}
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App