import React, { useState } from "react"
import axios from "axios"

const Contact = () => {
    const [reason, setReason] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    
    const reasonsList = [
        "Billing Issue",
        "Meter Malfunction",
        "Recharge Not Working",
        "Usage Discrepancy",
        "General Inquiry",
        "Other"
    ]
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus("")
        
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/user_contact/send", {
                token,
                reason,
                message
            })
            
            setStatus("Message sent successfully!")
            setReason("")
            setMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            setStatus("Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left side panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Need assistance? Reach out to our support team. We're here to help you
                    resolve issues with billing, meters, or general inquiries quickly and efficiently.
                </p>
            </div>
            
            {/* Right side (contact form) */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Contact Support
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Fill in the details below and we'll get back to you shortly
                    </p>
                    
                    {/* Status message */}
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
                    
                    {/* Contact form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason
                            </label>
                            <select
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Reason --</option>
                                {reasonsList.map((r, i) => (
                                    <option key={i} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
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
                              required
                              placeholder="Write your message here..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        {/* Submit button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
