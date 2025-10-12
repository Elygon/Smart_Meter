/*import React from "react"
import { Link, Outlet } from "react-router-dom"
import {
    LayoutDashboard,
    CreditCard,
    FileText,
    Lock,
    Ticket,
    LogOut
} from "lucide-react" // icons

const Dashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar }
            <aside className="w-64 bg-indigo-600 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-indigo-500">
                    PowerPay
                </div>
                <nav className="flex-1 p-4 space-y-3">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-500"
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/recharge"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-500"
                    >
                        <CreditCard size={20} /> Recharge
                    </Link>
                    <Link
                      to="/dashboard/logs"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-500"
                    >
                        <FileText size={20} /> Usage Logs
                    </Link>
                    <Link
                      to="/dashboard/tickets"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-500"
                    >
                        <Ticket size={20} /> My Tickets
                    </Link>
                    <Link
                      to="/dashboard/change-password"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-500"
                    >
                        <Lock size={20} /> Change Password
                    </Link>
                </nav>
                
                <div className="p-4 border-t border-indigo-500">
                    <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-indigo-500">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            
            {/* Main content *}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar *}
                <header className="h-16 bg-white shadow flex items-center justify-between px-6">
                    <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
                    <p className="text-gray-600">Welcome back 👋</p>
                </header>
                
                {/* Content Area /}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard
*/



import React from "react"
import { Link } from "react-router-dom"
import {
    LayoutDashboard,
    Zap,
    Clock,
    FileText,
    Bell,
    MessageSquare,
    CreditCard,
    Power,
    User,
    LogOut,
    Lock
} from "lucide-react"

const UserDashboard = () => {
    const readings = [
        { date: "2025-08-01", units: 120, cost: 3000 },
        { date: "2025-08-05", units: 90, cost: 2250 },
        { date: "2025-08-10", units: 150, cost: 3750 }
    ]
    
    const user = { fullname: "John Doe" }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] text-gray-200 flex flex-col p-6 rounded-r-3xl">
                <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
                <nav className="space-y-3">
                    <Link
                      to="/user/dashboard"
                      className="flex items-center gap-3 bg-[#1e293b] px-4 py-2 rounded-xl font-medium"
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      to="/user/recharge"
                      className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                    >
                        <CreditCard size={18} /> Recharge
                    </Link>
                    <Link
                      to="/user/recharge-history"
                      className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                    >
                        <Clock size={18} /> Recharge History
                    </Link>
                <Link
                  to="/user/logs"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <FileText size={18} /> Logs
                </Link>
                <Link
                  to="/user/my-tickets"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <MessageSquare size={18} /> Tickets
                </Link>
                <Link
                  to="/user/contact"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <Power size={18} /> Contact Support
                </Link>
                <Link
                  to="/user/notification"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <Bell size={18} /> Notifications
                </Link>
                <Link
                  to="/user/profile"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <User size={18} /> Profile
                </Link>
                <Link
                  to="/user/change-password"
                  className="flex items-center gap-3 hover:bg-[#1e293b] px-4 py-2 rounded-xl"
                >
                    <Lock size={18} /> Change Password
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-700">
                <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                    <LogOut size={18} />
                        Logout
                </button>
            </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-10">
            <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.fullname}!
            </h2>
            <p className="text-gray-600 mb-8">
                Here’s a quick overview of your smart meter account.
            </p>
            
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-sm rounded-xl p-5">
                    <p className="text-gray-500 text-sm">Total Units Consumed</p>
                    <h3 className="text-2xl font-semibold mt-2">360 kWh</h3>
                </div>
                <div className="bg-white shadow-sm rounded-xl p-5">
                    <p className="text-gray-500 text-sm">Current Bill</p>
                    <h3 className="text-2xl font-semibold mt-2">₦9,000</h3>
                </div>
                <div className="bg-white shadow-sm rounded-xl p-5">
                    <p className="text-gray-500 text-sm">Last Payment</p>
                    <h3 className="text-2xl font-semibold mt-2">₦3,750</h3>
                </div>
            </div>
                
            {/* Recent Readings */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold">Recent Meter Readings</h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left border-collapse text-gray-700">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-500">
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Units (kWh)</th>
                                    <th className="py-2">Cost (₦)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {readings.map((r, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2">{r.date}</td>
                                        <td className="py-2">{r.units}</td>
                                        <td className="py-2">{r.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[
                        {
                            to: "/user/apply",
                            title: "Apply for Meter",
                            desc: "Request a new prepaid or postpaid smart meter."
                        },
                        {
                            to: "/user/view-meters",
                            title: "View All Meters",
                            desc: "See a list of all meters linked to your account."
                        },
                        {
                            to: "/user/recharge",
                            title: "Recharge Meter",
                            desc: "Buy tokens or recharge your IoT meter balance."
                        },
                        {
                            to: "/user/recharge-history",
                            title: "Recharge History",
                            desc: "View all your recharge history and its details."
                        },
                        {
                            to: "/user/logs",
                            title: "Usage Logs",
                            desc: "Check how much energy you've consumed."
                        },
                        {
                            to: "/user/contact",
                            title: "Contact Support",
                            desc: "Send inquiries or complaints."
                        },
                    ].map((item, i) => (
                        <Link
                          key={i}
                          to={item.to}
                          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default UserDashboard