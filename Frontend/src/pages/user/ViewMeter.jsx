import React, { useState } from 'react'
import axios from 'axios'

const ViewMeter = () => {
    const [meterId, setMeterId] = useState("")
    const [meter, setMeter] = useState(null)
    const [error, setError] = useState("")

    const fetchMeter = async () => {
        setError("")
        setMeter(null)

        if (!meterId) {
            setError("Please enter a meter ID.")
            return
        }

        try {
            const token = localStorage.getItem("token") // user's auth token
            const res = await axios.post('http://localhost:4500/user_meter/view', // your backend endpoint for specific meter
                 { token, meterId: id }, // sending meterId in body (since you used POST in backend)
            )
      
            setMeter(res.data.meter)
        } catch (e) {
            console.error(err)
            setError(err.res?.data?.msg || 'Failed to fetch meter. Try again.')
        }          
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>View Specific Meter</h2>
            <P>Enter your meter ID to view its details.</P>
            <input 
            type="text" 
            placeholder="Enter Meter ID"
            value={meterId}
            onChange={(e) => setMeterId(e.target.value)} 
            style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={fetchMeter}>Fetch Meter</button>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {meter && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Meter Details</h3>
                    <p><strong>Number:</strong>{meter.meterNumber}</p>
                    <p><strong>Type:</strong>{meter.meterType}</p>
                    <p><strong>Tech:</strong>{meter.meterTech}</p>
                    <p><strong>Status:</strong>{meter.status}</p>
                </div>
            )}
        </div>
    )
}

export default ViewMeter