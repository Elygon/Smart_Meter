import React, { useState } from 'react'

const Contact = () => {
    const [reason, setReason] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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
        setError("")
        setSuccess("")

        const token = localStorage.getItem('userToken')
        if (!token) {
            setError("Please log in first.")
            setLoading(false)
            return
        }

        try {
            const res = await fetch('http://localhost:4500/user_contact', {
              method: 'POST',
              headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
              body: JSON.stringify({ reason, message })
            })
      
            const data = await res.json()

            if (res.ok) {
                setSuccess("Your message has been sent successfully.")
                setReason("")
                setMessage("")
            } else {
                setError(data.msg || "Something went wrong.")
            }
        } catch (e) {
            setError("Error connecting to server.")
        } finally {
            setLoading(false)
        }
          
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Contact Support</h2>
            <p>If you have any complaints or inquiries, please use the form below.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

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
                      onChange={(e) => setMessage(e.target.value)}placeholder="Describe your issue or inquiry..."
                      required
                    />
                </div>

                <button type="submit"disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    )
}

export default Contact