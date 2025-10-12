import React from "react"
import { Link } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    Zap,
    Bell,
    MessageSquare,
    FileText,
    LogOut,
    Lock
} from "lucide-react"

const AdminDashboard = ({ admin }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800 font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 rounded-r-2xl">
                <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
                
                <nav className="flex flex-col gap-3">
                    <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard />} text="Dashboard" active />
                    <SidebarLink to="/admin/manage-users" icon={<Users />} text="Manage Users" />
                    <SidebarLink to="/admin/manage-meters" icon={<Zap />} text="Manage Meters" />
                    <SidebarLink to="/admin/all-notifications" icon={<Bell />} text="Notifications" />
                    <SidebarLink to="/admin/replies" icon={<MessageSquare />} text="Reply to Tickets" />
                    <SidebarLink to="/admin/logs" icon={<FileText />} text="View Logs" />
                    <SidebarLink to="/user/change-password" icon={<Lock />} text="Change Password" />
                </nav>
                
                <div className="mt-auto pt-6 border-t border-gray-700">
                    <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-semibold mb-2">
                    Welcome back, {admin ? admin.fullname : "Admin"}!
                </h2>
                <p className="text-gray-600 mb-8">
                    Manage users, meters, notifications, and monitor system activity.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Total Users" value="124" icon={<Users className="text-green-500" />} />
                    <StatCard title="Active Meters" value="88" icon={<Zap className="text-blue-500" />} />
                    <StatCard title="Pending Tickets" value="5" icon={<MessageSquare className="text-orange-500" />} />
                </div>
                
                {/* Quick Actions */}
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard link="/admin/manage-users" title="Manage Users" desc="View all registered users." />
                    <ActionCard link="/admin/manage-meters" title="Manage Meters" desc="Monitor meters & status." />
                    <ActionCard link="/admin/all-notifications" title="Notifications" desc="Send or delete alerts." />
                    <ActionCard link="/admin/replies" title="Reply to Tickets" desc="Respond to user messages." />
                    <ActionCard link="/admin/logs" title="View Logs" desc="Monitor activities and events." />
                    <ActionCard link="/user/change-password" title="Change Password" desc="Update your admin password." />
                </div>
            </main>
        </div>
    )
}

// Sidebar Link Component
const SidebarLink = ({ to, icon, text, active }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
        {icon}
        <span>{text}</span>
    </Link>
)

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border border-gray-100">
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h4 className="text-xl font-semibold">{value}</h4>
        </div>
    </div>
)

// Action Card Component
const ActionCard = ({ link, title, desc }) => (
    <Link
      to={link}
      className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition"
      >
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
    </Link>
)

export default AdminDashboard