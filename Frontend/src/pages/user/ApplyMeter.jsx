import React, { useState } from 'react'
import axios from 'axios'

const ApplyMeter = () => {
    const [meterTech, setMeterTech] = useState ("") // e.g STS or IoT
    const [meterType, setMeterType] = useState("") // prepaid or postpaid
    const [address, setAddress] = useState ("")
    const [loading, setLoading] = useState (false)
    const [message, setMessage] = useState ("")

    const handleApply = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:4500/user_meter/apply',
                { meterTech, meterType, address },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
      
            setMessage(response.data.msg || "Meter application submitted successfully!")
            setMeterTech("")
            setMeterType("")
            setAddress("")

            } catch (err) {
                console.error("Apply meter error", err)
                setMessage(err.response?.data?.msg || 'Error applying for meter')
            } finally {
                setLoading(false)
            }
          
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Apply for a Meter</h2>
            <p>Fill in the details below to apply for a new smart meter.</p>

            <form onSubmit={handleApply}>
                <div>
                    <label>Meter Tech:</label>
                    <select
                    value={meterTech}
                    onChange={(e) => setMeterTech(e.target.value)}
                    required
                    >
                        <option value="">-- Select Tech --</option>
                        <option value="sts">STS</option>
                        <option value="iot">IoT</option>
                    </select>
                </div>

                <div>
                    <label>Meter Type:</label>
                    <select
                    value={meterType}
                    onChange={(e) => setMeterType(e.target.value)}
                    required
                    >
                        <option value="">-- Select Type --</option>
                        <option value="prepaid">Prepaid</option>
                        <option value="postpaid">Postpaid</option>
                    </select>
                </div>

                <div>
                    <label>Installation Address:</label>
                    <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your installation address"
                    required
                    />
                </div>

                <button type="submit"disabled={loading}>
                    {loading ? "Submitting..." : "Apply"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}

export default ApplyMeter