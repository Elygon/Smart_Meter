import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const ViewAllMeters = () => {
    const [meters, setMeters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.post("http://localhost:4500/user_meter/all", { token })
                setMeters(res.data.meters || res.data)
            } catch (e) {
                setError("Error fetching meters.")
            } finally {
                setLoading(false)
            }
        }
        fetchMeters()
    }, [])
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left dark panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    View all your registered meters at a glance. Access details quickly and manage your account with ease.
                </p>
            </div>
            
            {/* Right content panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        All Meters
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Below are the details of your registered meters.
                    </p>
                    
                    {loading && <p className="text-blue-600 text-center">Loading meters...</p>}
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    
                    {!loading && !error && (
                        <>
                        {meters.length === 0 ? (
                            <p className="text-center text-gray-600">No meters found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border-b text-left">Meter Number</th>
                                            <th className="px-4 py-2 border-b text-left">Meter Tech</th>
                                            <th className="px-4 py-2 border-b text-left">Meter Type</th>
                                            <th className="px-4 py-2 border-b text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meters.map((meter) => (
                                            <tr key={meter._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border-b">
                                                    {meter.meterNumber || "Not Assigned"}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">{meter.meterTech}</td>
                                                    <td className="px-4 py-2 border-b">{meter.meterType}</td>
                                                    <td className="px-4 py-2 border-b">
                                                    <button
                                                      onClick={() =>
                                                        navigate("/user/ViewMeter", { state: { meterId: meter._id } })
                                                    }
                                                    className="px-3 py-1 bg-[#0f172a] text-white rounded hover:bg-[#1e293b] transition"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewAllMeters