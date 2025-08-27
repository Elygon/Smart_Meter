import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewAllMeters = () => {
    const [meters, setMeters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token") //Token from login
                const res = await axios.post('http://localhost:4500/user_meter/all', { // backend endpoint for all meters
                    token
                })
                setMeters(res.data)
                } catch (e) {
                    setError('Error fetching meters.')
                } finally {
                    setLoading(false)
            }    
        }

        fetchMeters()
    }, [])

    if (loading) return <p>Loading meters...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    

    return (
        <div style={{ padding: "20px" }}>
            <h2>All Meters</h2>
            {meters.length > 0 ? (
                <p>No meters found.</p>
            ) : (
                <ul>
                    {meters.map((meter) => (
                        <li key={meter._id}>
                            {meter.type} - {meter.meterNumber || "Not Assigned"}{" "}
                            <button onClick={() => navigate("/user/ViewMeter", { state: {meterId: meter._id } })}>
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ViewAllMeters