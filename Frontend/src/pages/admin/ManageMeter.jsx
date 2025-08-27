import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ManageMeter = ({ meterId }) => {
    const [meter, setMeter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    // Fetch meter details
    const fetchMeter = async () => {
        try {
            const token = localStorage.getItem("token") // Admin token
            const res = await axios.post('http://localhost:4500/admin_meter/specific', // The backend endpoint
                { token, id: meterId } // send id in body
            )
            setMeter(res.data)
        } catch (err) {
            setError("Failed to fetch meter details.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMeter()
    }, [meterId])

    // Approve or Reject meter
    const handleApproval = async (status) => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post('http://localhost:4500/admin_meter/update',
                { token, meterId: id, status}
            )
            setMessage(`Meter ${status} successfully.`)
            fetchMeter()
        } catch (e) {
            alert("Failed to update status.")
        }
    }

    // Assign meter number
    const handleAssignNumber = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post('http://localhost:4500/admin_meter/assign',
                { token, meterId: id}
            )
            setMessage(`Meter number ${res.data.meterNumber} assigned successfully.`)
            fetchMeter()
        } catch (e) {
            alert("Failed to assign meter number.")
        }
    }

    // Update status dropdown
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value
        if (!newStatus) return

        try {
            const token = localStorage.getItem("token")
            const res = await axios.post('http://localhost:4500/admin_meter/update',
                { token, meterId: id, status: newStatus}
            )
            setMessage(`Meter updated to ${newStatus}.`)
            fetchMeter()
        } catch (e) {
            alert("Failed to update meter status.")
        }
    }

    if (loading) return <p>Loading meter details...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!meter) return <p>No meter data found.</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Meter Details</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            <p><strong>Status:</strong>{meter.status}</p>
            <p><strong>User:</strong>{meter.user?.fullname}({meter.user?.email})</p>
            <p><strong>Tech:</strong>{meter.tech}</p>
            <p><strong>Type:</strong>{meter.type}</p>
            <p><strong>Balance:</strong>{meter.balance}</p>
            <p><strong>Meter Number:</strong>{meter.meterNumber || "Not Assigned"}</p>

            {/* Conditional Actions*/}
            {meter.status === "pending" && (
                <div>
                    <button onClick={() => handleApproval("approved")}>Approve</button>
                    <button onClick={() => handleApproval("rejected")}>Reject</button>
                </div>
            )}

            {meter.status === "approved" && !meter.meterNumber && (
                <button onClick={handleAssignNumber}>Assign Meter Number</button>
            )}

            {/* Only allow further status updates if meter is not final */}
            {["approved", "installed"].includes(meter.status) && (
                <div style={{ marginTop: "10px" }}>
                    <label>Update Status: </label>
                    <select onChange={handleStatusChange}defaultValue="">
                        <option value="">-- Select --</option>
                        {meter.status === "approved" && <option value="installed">Installed</option>}
                        {meter.status === "installed" && <option value="active">Active</option>}
                    </select>
                </div>
            )}
            
            {(meter.status === "active" || meter.status === "rejected" || meter.status === "disconnected" ||
                meter.status === "faulty" || meter.status === "inactive") && (
                    <p>No further actions available. Meter is {meter.status}.</p>
            )}     
        </div>
    )
}

export default ManageMeter