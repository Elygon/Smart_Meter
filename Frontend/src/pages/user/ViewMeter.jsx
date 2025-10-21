import React, { useEffect, useState } from "react"
import axios from "axios"
import { useLocation } from "react-router-dom"

const ViewMeter = () => {
    const location = useLocation()
    const [meterId, setMeterId] = useState(location.state?.meterId || "")
    const [meter, setMeter] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    useEffect(() => {
        if (meterId) fetchMeter()
    }, [meterId])

    const fetchMeter = async () => {
        setError("")
        setMeter(null)
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
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    View detailed information about your selected meter.
                </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        View Meter
                    </h2>
                    
                    {loading && <p className="text-blue-600 text-center">Loading meter...</p>}
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    
                    {meter ? (
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

                    ) : !loading && (
                        <p className="text-gray-500 text-center mt-4">No meter selected.</p>
                    )}
                </div>
            </div>
         </div>
    )
}

export default ViewMeter
