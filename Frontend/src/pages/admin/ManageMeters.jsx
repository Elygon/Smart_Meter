import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ManageMeters = () => {
    const [meters, setMeters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem("token") // admin token
                const res = await axios.post('http://localhost:4500/admin_meter/all',
                    { token }
                )
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
            <h2>Manage Meters</h2>
            
            {meters.length === 0 ? (
                <p>No meters found.</p>
            ) :(
                <table border="1" cellPadding="8"style={{ marginTop: "20px", width: "100% "}}>
                    <thead>
                        <tr>
                        <th>Meter ID</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Tech</th>
                        <th>Meter Number</th>
                        <th>Status</th> {/* Shows account state */}
                        <th>Action</th> {/* Shows admin actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {meters.map((meter) => (
                            <tr key={meter._id}>
                                <td>{meter._id}</td>
                                <td>{meter.user?.fullname || "N/A"}</td>
                                <td>{meter.type}</td>
                                <td>{meter.tech}</td>
                                <td>{meter.status}</td>
                                <td>{meter.meterNumber || "Not assigned"}</td>
                                <td>
                                    <button onClick={() => navigate("/admin/ManageMeter", { state: { meterId: meter._id} })}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ManageMeters