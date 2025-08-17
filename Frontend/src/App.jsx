import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// User pages
import SignUp from './pages/user/SignUp'
import UserLogin from './pages/user/Login'
import ChangePassword from './pages/user/ChangePassword'
import ForgotPassword from './pages/user/ForgotPassword'
import ResetPassword from './pages/user/ResetPassword'
import UserDashboard from './pages/user/Dashboard'
import ApplyMeter from './pages/user/ApplyMeter'
import ViewAllMeters from './pages/user/ViewAllMeters'
import ViewMeter from './pages/user/ViewMeter'
import Recharge from './pages/user/Recharge'
import RechargeHistory from './pages/user/RechargeHistory'
import Log from './pages/user/Log'
import Notification from './pages/user/Notification'
import Contact from './pages/user/Contact'
import MyTicket from './pages/user/MyTicket'
import MyTickets from './pages/user/MyTickets'

// Admin pages
import Register from './pages/admin/Register'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ApproveRecharges from './pages/admin/ApproveRecharges'
import RechargeHistory from './pages/admin/RechargeHistory'
import AdminLogs from './pages/admin/ViewLogs'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/apply" element={<ApplyMeter />} />
        <Route path="/user/view-meters" element={<ViewAllMeters />} />
        <Route path="/user/view-meter" element={<ViewMeter />} />
        <Route path="/user/recharge" element={<Recharge />} />
        <Route path="/user/recharge-history" element={<RechargeHistory />} />
        <Route path="/user/logs" element={<Log />} />
        <Route path="/user/contact" element={<MyTicket />} />
        <Route path="/user/contact" element={<MyTickets />} />
        <Route path="/user/notification" element={<Notification />} />
        <Route path="/user/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-meters" element={<ManageMeters />} />
        <Route path="/admin/approve-recharges" element={<ApproveRecharges />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Routes>
    </Router>
  )
}

export default App
