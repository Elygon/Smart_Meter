import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const ViewMeter = () => {
    const [meterId, setMeterId] = useState("")
    const [meter, setMeter] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    const fetchMeter = async () => {
        setError("")
        setMeter(null)

        if (!meterId) {
            setError("Please enter a meter ID.")
            return
        }

        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/user_meter/view", { token, meterId })
            setMeter(res.data.meter)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.msg || "Failed to fetch meter. Try again.")
        } finally {
            setLoading(false)
        }
    }
  
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left dark panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    View a specific meter and its details quickly. Manage your account efficiently.
                </p>
            </div>
            
            {/* Right content panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        View Meter
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Enter the meter ID below to see its details.
                    </p>
                    
                    {/* Input section */}
                    <div className="flex gap-2 mb-5">
                        <input
                          type="text"
                          placeholder="Enter Meter ID"
                          value={meterId}
                          onChange={(e) => setMeterId(e.target.value)}
                          className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={fetchMeter}
                          className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg shadow-md font-medium transition"
                        >
                            Fetch
                        </button>
                    </div>
                    
                    {loading && <p className="text-blue-600 text-center">Loading meter...</p>}
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    
                    {/* Meter details */}
                    {meter && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border-b text-left">Meter Number</th>
                                        <th className="px-4 py-2 border-b text-left">Meter Tech</th>
                                        <th className="px-4 py-2 border-b text-left">Meter Type</th>
                                        <th className="px-4 py-2 border-b text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{meter.meterNumber || "Not Assigned"}</td>
                                        <td className="px-4 py-2 border-b">{meter.meterTech}</td>
                                        <td className="px-4 py-2 border-b">{meter.meterType}</td>
                                        <td className="px-4 py-2 border-b">{meter.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default ViewMeter
