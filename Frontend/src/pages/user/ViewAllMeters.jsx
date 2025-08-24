import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewAllMeters = () => {
    const [meters, setMeters] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token") //Token from login
                const res = await axios.post('http://localhost:4500/user_meter/all', // backend endpoint for all meters
                    {}, // no body needed
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                )
          
                setMeters(res.data.meters || [])
                } catch (e) {
                    console.error(err)
                    setError(err.res?.data?.msg || 'Error fetching meters.')
            }    
        }

        fetchMeters()
    }, [])
    

    return (
        <div style={{ padding: "20px" }}>
            <h2>All Meters</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {meters.length > 0 ? (
                <table border="1" cellPadding="10"style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                        <th>Meter ID</th>
                        <th>Type</th>
                        <th>Tech</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meters.map((meter) => (
                            <tr key={meter._id}>
                                <td>{meter._id}</td>
                                <td>{meter.type}</td>
                                <td>{meter.tech}</td>
                                <td>{meter.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
            !error && <p>No meters found for this user.</p>
            )}
        </div>
    )
}

export default ViewAllMeters