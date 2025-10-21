import React, { useEffect, useState } from "react"
import axios from "axios"

const RechargeHistory = () => {
    const [recharges, setRecharges] = useState([])
    const [selectedRecharge, setSelectedRecharge] = useState(null)
    const message = useState("")
    const [error, setError] = useState("")

    // Fetch recharge history
    useEffect(() => {
        const fetchRecharges = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.post("http://localhost:4500/user_recharge/all", { token })
                setRecharges(Array.isArray(res.data) ? res.data : res.data.recharges || [])
                setError("")
            } catch (e) {
                console.error("Error fetching recharges:", e)
                setError("Failed to load recharge history.")
            }
        }
        fetchRecharges()
    }, [])

    // Fetch a single recharge record
    const viewRecharge = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/user_recharge/view", {
                token,
                rechargeId: id,
            })
            setSelectedRecharge(res.data)
            setError("")
        } catch (e) {
            console.error("Error fetching recharge:", e)
            setError("Failed to load recharge details.")
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left dark panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    Review all your meter recharge transactions here. 
                    Track payment methods, reference numbers, and recharge statuses easily.
                </p>
            </div>

            {/* Right content section */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Recharge History
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        View your previous recharge transactions and details
                    </p>

                    {message && (
                        <p className="text-center text-green-600 mb-4 font-medium">{message}</p>
                    )}
                    {error && (
                        <p className="text-center text-red-600 mb-4 font-medium">{error}</p>
                    )}

                    {/* No records */}
                    {recharges.length === 0 ? (
                        <p className="text-gray-500 text-center">No recharge records found.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recharges.map((recharge) => (
                                <li
                                    key={recharge._id}
                                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                                >
                                    <div className="text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">Reference:</span>{" "}
                                            {recharge.reference}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Amount:</span> ₦
                                            {recharge.amount}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Status:</span>{" "}
                                            {recharge.status}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => viewRecharge(recharge._id)}
                                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-lg transition"
                                    >
                                        View Details
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Selected recharge details */}
                    {selectedRecharge && (
                        <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                                Recharge Details
                            </h3>
                            <div className="space-y-1 text-gray-700 text-sm">
                                <p>
                                    <span className="font-semibold">Reference:</span>{" "}
                                    {selectedRecharge.reference}
                                </p>
                                <p>
                                    <span className="font-semibold">Meter ID:</span>{" "}
                                    {selectedRecharge.meterId}
                                </p>
                                <p>
                                    <span className="font-semibold">Amount:</span> ₦
                                    {selectedRecharge.amount}
                                </p>
                                <p>
                                    <span className="font-semibold">Payment Method:</span>{" "}
                                    {selectedRecharge.paymentMethod}
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    {selectedRecharge.status}
                                </p>
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {new Date(selectedRecharge.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RechargeHistory
