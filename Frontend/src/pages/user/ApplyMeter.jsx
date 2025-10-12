import React, { useState } from "react"
import axios from "axios"

const ApplyMeter = () => {
    const [meterTech, setMeterTech] = useState("") // e.g STS or IoT
    const [meterType, setMeterType] = useState("") // prepaid or postpaid
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    
    const handleApply = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(
                "http://localhost:4500/user_meter/apply",
                { token, meterTech, meterType, address }
            )
            
            setMessage(response.data.msg || "Meter application submitted successfully!")
            setMeterTech("")
            setMeterType("")
            setAddress("")
        } catch (err) {
            console.error("Apply meter error", err)
            setMessage(err.response?.data?.msg || "Error applying for meter")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left side panel (same as login/signup) */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Apply for your new smart meter — choose your meter type, technology and provide your installation address in minutes.
                </p>
            </div>
            
            {/* Right panel (form) */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Apply for a Meter
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Fill in the details below to request a new smart meter
                    </p>
                    
                    <form onSubmit={handleApply} className="space-y-4">
                        {/* Meter Tech */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meter Technology
                            </label>
                            <select
                              value={meterTech}
                              onChange={(e) => setMeterTech(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Technology --</option>
                                <option value="sts">STS</option>
                                <option value="iot">IoT</option>
                            </select>
                        </div>
                        
                        {/* Meter Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meter Type
                            </label>
                            <select
                              value={meterType}
                              onChange={(e) => setMeterType(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Type --</option>
                                <option value="prepaid">Prepaid</option>
                                <option value="postpaid">Postpaid</option>
                            </select>
                        </div>
                        
                        {/* Installation Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Installation Address
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your installation address"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
                        >
                            {loading ? "Submitting..." : "Apply"}
                        </button>
                    </form>
                    
                    {/* Response Message */}
                    {message && (
                        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApplyMeter
