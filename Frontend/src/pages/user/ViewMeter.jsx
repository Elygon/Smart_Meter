import React, { useState } from 'react'

const ViewMeter = () => {
    const [meterId, setMeterId] = useState("")
    const [meter, setMeter] = useState(null)
    const [error, setError] = useState("")

    const fetchMeter = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch('http://localhost:4500/user_meter/specific', {
              method: 'POST',
              headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
              body: JSON.stringify({ token, meterId })
            })
      
            const data = await res.json()
            if (data.status === "success") {
                setMeter(data.meter)
                setError("")
            } else {
                setError (data.msg || "Meter not found.")
            }
        } catch (e) {
            setError('Error fetching meter.')
        }
          
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>View Specific Meter</h2>
            <input 
            type="text" 
            placeholder="Enter Meter ID"
            value={meterId}
            onChange={(e) => setMeterId(e.target.value)} 
            />
            <button onClick={fetchMeter}>Search</button>
            
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