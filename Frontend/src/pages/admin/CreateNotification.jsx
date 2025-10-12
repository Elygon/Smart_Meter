import React, { useState } from "react"
import axios from "axios"

const CreateNotification = () => {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState("info")
    const [target, setTarget] = useState("all")
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus("")
        
        try {
            const token = localStorage.getItem("token")
            const payload = target === "all"
            ? { token, title, message, type, all: true }
            : { token, user_id: userId, title, message, type }
            
            await axios.post("http://localhost:4500/admin_notication/send", payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            setStatus("Notification sent successfully!")
            setTitle("")
            setMessage("")
            ("")
            setType("info")
            setTarget("all")
        } catch (error) {
            console.error("Error sending notification:", error)
            setStatus("Failed to send notification. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side Panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Send notifications to members of the platform — whether it's a general announcement,
                    an important alert, or a direct message to a specific user.
                </p>
            </div>
            
            {/* Right Side Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Create Notification
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Fill in the details below to send a notification.
                    </p>
                    
                    {/* Status Message */}
                    {status && (
                        <p className={`text-center mb-4 font-medium ${
                            status.toLowerCase().includes("success")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                        >
                            {status}
                        </p>
                    )}
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                              aceholder="Enter title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows="4"
                              placeholder="Enter your message..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                              value={type}
                              onChange={(e) => setType(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="info">Info</option>
                                <option value="alert">Alert</option>
                                <option value="warning">Warning</option>
                                <option value="update">Update</option>
                            </select>
                        </div>
                        
                        {/* Target */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target
                            </label>
                            <select
                              value={target}
                              onChange={(e) => setTarget(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Users</option>
                                <option value="single">Single User</option>
                            </select>
                        </div>
                        
                        {/* User ID (if single) */}
                        {target === "single" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User ID
                                </label>
                                <input
                                  type="text"
                                  value={userId}
                                  placeholder="Enter user ID"
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}
                        
                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Notification"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateNotification
