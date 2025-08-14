import React, { useState } from 'react'

const Recharge = () => {
    const [meterId, setMeterId] = useState("")
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [reference, setReference] = useState("")
    const [meters, setMeters] = useState("")

    // Fetch user's meters on page load
    useEffect(() => {
        const fetchMeters = async () => {
            const token = localStorage.getItem('userToken')

            try {
                const response = await fetch('http://localhost:4500/user_meter/all', {
                  headers: {Authorization: `Bearer ${token}`}
                })
          
                const data = await response.json()
                setMeters(data.meters || [])
                } catch (e) {
                    console.error(e)
                }
            }

            fetchMeters()
        }, [])

        //Auto-generate reference for cash & admin manual payments
        useEffect(() => {
            if (paymentMethod === "cash" || paymentMethod === "admin manual") {
                setReference(paymentMethod.toUpperCase().replace(" ", "_") + "-" + Date.now())
            } else {
                setReference("")
            }
        }, [paymentMethod])

        const handleRecharge = async (e) => {
            e.preventDefault()
            const token = localStorage.getItem("UserToken")

        try {
            const response = await fetch('http://localhost:4500/user_recharge/request', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                token,
                meterId,
                amount,
                paymentMethod,
                reference
            })
        })
      
        const data = await response.json()
        alert(data.msg || "Recharge request sent!")
    } catch (e) {
        console.error(e)
        alert('Error sending recharge request')
    }
}

return (
<div>
    <h2>Recharge Your Meter</h2>
    <form onSubmit={handleRecharge}>
        {/* Meter selection */}
        <select value={meterId} onChange={(e) => setMeterId(e.target.value)} required>
            <option value="">Select Meter</option>
            {meters.map((m) => (
                <option key={m._id} value={m._id}>
                    {m.meterNumber} ({m.meterType} - {m.meterTech})
                </option>
            ))}
        </select>
        <br />

        {/* Payment Method */}
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="card payment">Card Payment</option>
            <option value="admin manual">Admin Manual</option>
            </select>
            <br />

            {/* Reference field */}
            {paymentMethod === "bank transfer" || paymentMethod === "card payment" ? (
                <>
                <input
                type="text"
                placeholder="Enter Payment Reference / Transaction ID"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
                />
                <br />
                </>
            ) : paymentMethod && (
                <p>Generated Reference: <strong>{reference}</strong></p>
            )}

            <button type="submit">Recharge</button>
            </form>
        </div>
    )
}

export default Recharge