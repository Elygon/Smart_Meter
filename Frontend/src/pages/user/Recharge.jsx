import React, { useState, useEffect } from "react"
import axios from "axios"

const Recharge = () => {
    const [meterId, setMeterId] = useState("")
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [meters, setMeters] = useState([])
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
    // Fetch user's meters
    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.post("http://localhost:4500/user_meter/all", { token })
                setMeters(res.data.meters || res.data)
            } catch (err) {
                console.error("Error fetching meters:", err)
                setError("Failed to fetch meters.")
            }
        }
        fetchMeters()
    }, [])
    
    // Handle recharge form submission
    const handleRecharge = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)
        const autoReference = `REF-${Date.now()}`
        
        try {
            const token = localStorage.getItem("token")
            await axios.post("http://localhost:4500/user_recharge/request", {
                token,
                meterId,
                amount,
                paymentMethod,
                reference: autoReference
            })
            
            setMessage(`Recharge submitted successfully! Ref: ${autoReference}`)
            setMeterId("")
            setAmount("")
            setPaymentMethod("")
        } catch (err) {
            console.error("Recharge error:", err)
            setError("Failed to submit recharge request.")
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
                    Instantly recharge your prepaid or postpaid meter with ease.
                    Choose your payment method, enter your amount, and keep your power flowing without interruption.
                </p>
            </div>
            
            {/* Right side form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Meter Recharge
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Fill in your meter details to proceed with your recharge
                    </p>
                    
                    {message && (
                        <p className="text-center text-green-600 mb-4 font-medium">{message}</p>
                    )}
                    {error && (
                        <p className="text-center text-red-600 mb-4 font-medium">{error}</p>
                    )}
                        
                    <form onSubmit={handleRecharge} className="space-y-5">
                        {/* Meter select */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Select Meter</label>
                            <select
                                value={meterId}
                                onChange={(e) => setMeterId(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                             >
                                <option value="">-- Choose Meter --</option>
                                {meters.map((meter) => (
                                    <option key={meter._id} value={meter._id}>
                                        {meter.meterNumber} ({meter.meterType} - {meter.meterTech})
                                    </option>
                                ))}
                            </select>
                        </div>
                            
                        {/* Amount */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                            />
                        </div>
                            
                        {/* Payment Method */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                            >
                                <option value="">Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="bank transfer">Bank Transfer</option>
                                <option value="card payment">Card Payment</option>
                                <option value="admin manual">Admin Manual</option>
                            </select>
                        </div>
                            
                        {/* Auto Reference */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">
                                Reference (Auto-Generated)
                            </label>
                            <input
                                type="text"
                                value={`REF-${Date.now()}`}
                                readOnly
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                            />
                        </div>
                            
                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2 rounded-lg transition duration-200"
                        >
                            {loading ? "Processing..." : "Recharge"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Recharge
