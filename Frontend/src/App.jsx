import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

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
import Logs from './pages/user/Logs'
import Notification from './pages/user/Notification'
import Contact from './pages/user/Contact'
import MyTicket from './pages/user/MyTicket'
import MyTickets from './pages/user/MyTickets'

// Admin pages
//import Register from './pages/admin/Register' // only if supervisor insists
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageUser from './pages/admin/ManageUser'
import ManageMeters from './pages/admin/ManageMeters'
import ManageMeter from './pages/admin/ManageMeter'
import Recharges from './pages/admin/Recharges'
/*import AdminLogs from './pages/admin/ViewLogs'*/
import CreateNotification from './pages/admin/CreateNotification'
import AllNotifications from './pages/admin/AllNotifications'
import AdminNotification from './pages/admin/AdminNotification'
import ManageTickets from './pages/admin/ManageTickets'
import ManageTicket from './pages/admin/ManageTicket'

/*import RequireAdmin from './components/RequireAdmin'
/*import RequireUser from './components/RequireUser'
/*import AccessDenied from './pages/AccessDenied'*/


/*
const App = () => {
  return (
    <Router>
      <Routes>
      /*
        {/* Default redirect to login */
        /*
        <Route path="/" element={<Navigate to="/user/login" />} />

        {/* Public routes */
        /*
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin/login" element={<RequireAdmin><AdminLogin /></RequireAdmin>} />

        {/* Protected User Routes */
        /*
        <Route path="/user/change_password" element={<RequireUser><ChangePassword /></RequireUser>} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/apply" element={<RequireUser><ApplyMeter /></RequireUser>} />
        <Route path="/user/view-meters" element={<RequireUser><ViewAllMeters /></RequireUser>} />
        <Route path="/user/view-meter" element={<RequireUser><ViewMeter /></RequireUser>} />
        <Route path="/user/recharge" element={<RequireUser><Recharge /></RequireUser>} />
        <Route path="/user/recharge-history" element={<RequireUser><RechargeHistory /></RequireUser>} />
        <Route path="/user/log" element={<RequireUser><Log /></RequireUser>} />
        <Route path="/user/my-tickets" element={<RequireUser><MyTickets /></RequireUser>} />
        <Route path="/user/my-ticket" element={<RequireUser><MyTicket /></RequireUser>} />
        <Route path="/user/notification" element={<RequireUser><Notification /></RequireUser>} />
        <Route path="/user/contact" element={<RequireUser><Contact /></RequireUser>} />

        {/* Protected Admin Routes */
        /*
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/manage-users" element={<RequireAdmin><ManageUsers /></RequireAdmin>} />
        <Route path="/admin/manage-user" element={<RequireAdmin><ManageUser /></RequireAdmin>} />
        <Route path="/admin/manage-meters" element={<RequireAdmin><ManageMeters /></RequireAdmin>} />
        <Route path="/admin/manage-meter" element={<RequireAdmin><ManageMeter /></RequireAdmin>} />
        <Route path="/admin/create-notification" element={<RequireAdmin><CreateNotification /></RequireAdmin>} />
        <Route path="/admin/all-notifications" element={<RequireAdmin><AllNotifications /></RequireAdmin>} />
        <Route path="/admin/notification" element={<RequireAdmin><AdminNotification /></RequireAdmin>} />
        <Route path="/admin/manage-tickets" element={<RequireAdmin><ManageTickets /></RequireAdmin>} />
        <Route path="/admin/manage-ticket" element={<RequireAdmin><ManageTicket /></RequireAdmin>} />

        {/* Access Denied Page */
        /*
        <Route path="/access-denied" element={<AccessDenied />} />
        */

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/apply" element={<ApplyMeter />} />
        <Route path="/user/view-meters" element={<ViewAllMeters />} />
        <Route path="/user/view-meter" element={<ViewMeter />} />
        <Route path="/user/recharge" element={<Recharge />} />
        <Route path="/user/recharge-history" element={<RechargeHistory />} />
        <Route path="/user/logs" element={<Logs />} />
        <Route path="/user/my-tickets" element={<MyTickets />} />
        <Route path="/user/my-ticket" element={<MyTicket />} />
        <Route path="/user/contact" element={<Contact />} />
        <Route path="/user/notification" element={<Notification />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/recharges" element={<Recharges />} />
        <Route path="/admin/create-notification" element={<CreateNotification />} />
        <Route path="/admin/all-notifications" element={<AllNotifications />} />
        <Route path="/admin/admin-notification" element={<AdminNotification />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-user" element={<ManageUser />} />

      </Routes>
    </Router>
  )
}

export default App
