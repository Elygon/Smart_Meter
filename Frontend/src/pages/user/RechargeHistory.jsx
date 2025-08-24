import React, { useEffect, useState } from 'react'
import axios from 'axios'

const RechargeHistory = () => {
    const [recharges, setRecharges] = useState([])
    const [selectedRecharge, setSelectedRecharge] = useState(null)
    const [error, setError] = useState("")


    // Fetch all recharge history records on page load
    useEffect(() => {
        const fetchRecharges = async () => {
            try {
                const token = localStorage.getItem('token')
                
                    const res = await axios.post("http://localhost:4500/user_recharge/all", // endpoint for all recharges
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    )
                
                    setRecharges(res.data) // store array of recharge records
                } catch (e) {
                    console.error("Error fetching recharges:", err)
                    setError("Failed to load recharge history.")
                }
            }

            fetchRecharges()
    }, [])

    // Fetch a single recharge record when clicked
    const viewRecharge = async (id) => {
        try {
            const token = localStorage.getItem('token')
                const res = await axios.post('http://localhost:4500/user_recharge/view',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    }
                )

                setSelectedRecharge(res.data)
                setError("")
            } catch (e) {
                console.error("Error fetching recharge:", err)
                setError("Failed to load recharge details.")
            }
        }

        return (
            <div style={{ padding: '20px' }}>
                <h2>Recharge History</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* List of recharge records */}
                <ul>
                    {recharges.map((recharge) => (
                        <li key={recharge._id}>
                            <strong>Reference:</strong>{recharge.reference} | {" "}
                            <strong>Amount:</strong>{recharge.amount} | {" "}
                            <strong>Status:</strong>{recharge.status} | {" "}
                            <button onClick={() => viewRecharge(recharge._id)}>
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
                
                {/* Selected recharge details*/}
                {selectedRecharge && (
                    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc "}}>
                        <h3>Recharge Details</h3>
                        <p><strong>Reference:</strong>{selectedRecharge.reference}</p>
                        <p><strong>Meter ID:</strong>{selectedRecharge.meterId}</p>
                        <p><strong>Amount:</strong>{selectedRecharge.amount}</p>
                        <p><strong>Payment Method:</strong>{selectedRecharge.paymentMethod}</p>
                        <p><strong>Status:</strong>{selectedRecharge.status}</p>
                        <p><strong>Date:</strong>{newDate(selectedRecharge.createdAt).toLocaleString()}</p>
                    </div>
                )}
        </div>
    )
}

export default RechargeHistory