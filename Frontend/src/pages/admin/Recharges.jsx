import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Recharges = () => {
    const [recharges, setRecharges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch all recharge requests
    const fetchRecharges = async () => {
        try {
            const token = localStorage.getItem("token") // admin token
            const res = await axios.post('http://localhost:4500/admin_recharge/all',{
                token
            })
            setRecharges(res.data)
        } catch (e) {
            setError('Error fetching recharges.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecharges()
    }, [])
        

    // Approve/Reject recharge
    const handleAction = async (rechargeId, action) => {
        try {
            const token = localStorage.getItem("token")
            await axios.post('http://localhost:4500/admin_recharge/update', { 
                    token,
                    rechargeId, 
                    action  // 'approve' | 'reject'
            })
            fetchRecharges() // refresh list
        } catch (e) {
            alert("Failed to update recharge status.")
        }
    }

    // Delete recharge
    const handleDelete = async (rechargeId) => {
        if (!window.confirm("Are you sure you want to delete this recharge?")) return

        try {
            const token = localStorage.getItem("token") // admin token
            await axios.post('http://localhost:4500/admin_recharge/invalid', 
                { token, rechargeId }
            )
            fetchRecharges()
        } catch (e) {
            alert('Failed to delete recharge.')
        }
    }

    if (loading) return <p>Loading recharges...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Recharges</h2>
            
            {recharges.length === 0 ? (
                <p>No recharge records found.</p>
            ) :(
                <table border="1" cellPadding="8"style={{ marginTop: "20px", width: "100% "}}>
                    <thead>
                        <tr>
                        <th>User</th>
                        <th>Meter</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Requested At</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recharges.map((rec) => (
                            <tr key={rec._id}>
                                <td>{rec.user?.fullname}({rec.user?.email})</td>
                                <td>{rec.meter?.meterNumber || "N/A"}</td>
                                <td>{rec.amount}</td>
                                <td>{rec.status}</td>
                                <td>{new Date(rec.createdAt).toLocaleString()}</td>
                                <td>
                                    {rec.status === "pending" ? (
                                        <>
                                        <button onClick={() => handleAction(rec._id, "approve")}>
                                            Approve
                                        </button>{" "}
                                        <button onClick={() => handleAction(rec._id, "reject")} style={{ color: "red" }}>
                                            Reject
                                        </button>{" "}
                                        </>
                                    ) : (
                                        <span> Processed</span>
                                    )}
                                    <button onClick={() => handleDelete(rec._id)} style={{ marginLeft: 8 }}>
                                        Delete
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

export default Recharges