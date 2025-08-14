import React, { useEffect, useState } from 'react'

const ViewAllMeters = () => {
    const [meters, setMeters] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token") //Token from login
                const res = await fetch('http://localhost:4500/user_meter/all', {
                  method: 'POST', // backend uses POST
                  headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                  body: JSON.stringify({ token })
                })
          
                const data = await res.json()
                if (data.status === "success") {
                    setMeters(data.meters || [])
                } else {
                    setError (data.msg || "Failed to fetch meters.")
                }
            } catch (e) {
                setError('Error fetching meters.')
            }    
        }

        fetchMeters()
    }, [])
    

    return (
        <div style={{ padding: "20px" }}>
            <h2>All Meters</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {meters.length > 0 ? (
                <ul>
                    {meters.map((meter) => (
                        <li key={meter._id}>
                            {meter.meterNumber} - {meter.meterType} ({meter.meterTech})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No meters found.</p>
            )}
        </div>
    )
}

export default ViewAllMeters