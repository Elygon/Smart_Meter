import React, { useState } from 'react'
import axios from 'axios'

const Recharge = () => {
    const [meterId, setMeterId] = useState("")
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [reference, setReference] = useState("")
    const [meters, setMeters] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    // Fetch user's meters on page load
    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await axios.post('http://localhost:4500/user_meter/all',
                    { token }
                )

                // If response is an object with meters array, adjust this:
                setMeters(response.data.meters || response.data)
                } catch (e) {
                    console.error("Error fetching meters:", err)
                    setError("Failed to fetch meters.")
                }
            }

            fetchMeters()
        }, [])

        // Handle recharge form submission
        const handleRecharge = async (e) => {
            e.preventDefault()

            // Auto-generate reference like "REF-20250816-123456"
            const autoReference = `REF-${Date.now()}`
            
            try {
                const token = localStorage.getItem("token")

                const response = await axios.post('http://localhost:4500/user_recharge/request',
                    {
                        token,
                        meterId,
                        amount,
                        paymentMethod,
                        reference: autoReference  // Auto-generated
                    }
                )

                setMessage(`Recharge submitted! Ref: ${autoReference}`)
                setError("")
                console.log("Recharge response:", response.data)
            } catch (e) {
                console.error("Error submitting recharge request:", err)
                setError("Failed to submit recharge request.")
                setMessage("")
            }
        }
        
        return (
            <div>
                <h2>Recharge Your Meter</h2>

                {message && <p style={{ color: "green" }}>{message}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <form onSubmit={handleRecharge}>
                    {/* Select Meter */}
                    <label>Choose Meter:</label>
                    <select 
                    value={meterId}
                    onChange={(e) => setMeterId(e.target.value)}
                    required
                >
                    <option value="">-- Select Meter --</option>
                    {meters.map((meter) => (
                        <option key={meter._id} value={meter._id}>
                            {meter.meterNumber} ({meter.meterType} - {meter.meterTech})
                        </option>
                    ))}
                    </select>
                    <br /><br />

                    {/* Amount */}
                    <label>Amount:</label>
                    <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                    <br /><br />
                    
                    {/* Payment Method */}
                    <label>Payment Method:</label>
                    <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="bank transfer">Bank Transfer</option>
                    <option value="card payment">Card Payment</option>
                    <option value="admin manual">Admin Manual</option>
                    </select>
                    <br /><br />
                    
                    {/* Reference field */}
                    <label>Reference:</label>
                    <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Transaction reference or note"
                    required
                />
                <br /><br />
                
                <button type="submit">Recharge</button>
                </form>
            </div>   
    )
}

export default Recharge