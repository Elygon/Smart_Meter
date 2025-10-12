import React, { useEffect, useState } from "react"
import axios from "axios"

const Recharges = () => {
    const [recharges, setRecharges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    const fetchRecharges = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/admin_recharge/all", {
                token,
            })
            setRecharges(res.data)
        } catch (e) {
            setError("Error fetching recharges.")
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchRecharges()
    }, [])
    
    const handleAction = async (rechargeId, action) => {
        try {
            const token = localStorage.getItem("token")
            await axios.post("http://localhost:4500/admin_recharge/update", {
                token,
                rechargeId,
                action
            })
            fetchRecharges()
        } catch (e) {
            alert("Failed to update recharge status.")
        }
    }
    
    const handleDelete = async (rechargeId) => {
        if (!window.confirm("Are you sure you want to delete this recharge?")) return
        
        try {
            const token = localStorage.getItem("token")
            await axios.post("http://localhost:4500/admin_recharge/invalid", {
                token,
                rechargeId
            })
            fetchRecharges()
        } catch (e) {
            alert("Failed to delete recharge.")
        }
    }
    
    if (loading) return (
        <p className="text-center py-6 text-blue-600 font-medium">
            Loading recharges...
        </p>
    )
        
    if (error) return (
        <p className="text-center py-6 text-red-600 font-medium">{error}</p>
    )
    
    return (
        <div className="max-w-5xl mx-auto p-6 mt-8 bg-white shadow-md rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Recharges</h2>
            
            {recharges.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                    No recharge records found.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">User</th>
                                <th className="px-4 py-2 border-b text-left">Meter</th>
                                <th className="px-4 py-2 border-b text-left">Amount</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                                <th className="px-4 py-2 border-b text-left">Requested At</th>
                                <th className="px-4 py-2 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recharges.map((rec) => (
                                <tr
                                  key={rec._id}
                                  className="hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="px-4 py-2 border-b">
                                        {rec.user?.fullname} ({rec.user?.email})
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {rec.meter?.meterNumber || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border-b font-semibold text-gray-800">
                                        ₦{rec.amount}
                                    </td>
                                    <td
                                        className={`px-4 py-2 border-b font-medium ${
                                            rec.status === "approved"
                                            ? "text-green-600"
                                            : rec.status === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                    >
                                        {rec.status}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(rec.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 border-b space-x-2">
                                        {rec.status === "pending" ? (
                                            <>
                                                <button
                                                  onClick={() => handleAction(rec._id, "approve")}
                                                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                  onClick={() => handleAction(rec._id, "reject")}
                                                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Processed</span>
                                        )}
                                        <button
                                          onClick={() => handleDelete(rec._id)}
                                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm hover:bg-gray-400 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Recharges
