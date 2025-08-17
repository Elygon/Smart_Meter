import React, { useState } from 'react'
import axios from 'axios'

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

        try {
            // Send request using axios
            const token = localStorage.getItem('token') // user token from login

            const res = await axios.post('http://localhost:4500/user_contact/send',
                { reason, message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
      
            setStatus("Message sent successfully.")
            setReason("")
            setMessage("")
        } catch (e) {
            console.error("Error connecting to server.", error)
            setStatus("Failed to send message. Please try again")
        } finally {
            setLoading(false)
        }
          
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Contact Support</h2>
            <p>Send us your inquiry or complaint. Our support team will respond.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Reason:</label>
                    <select value={reason}onChange={(e) => setReason(e.target.value)}required>
                        <option value="">-- Select Reason --</option>
                        {reasonsList.map((r, i) => (
                            <option key={i} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div>   
                    <label>Message:</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                </div>

                <button type="submit"disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </button>
            </form>

            {status && <p>{status}</p>}
        </div>
    )
}

export default Contact