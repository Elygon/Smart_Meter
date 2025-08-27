import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ManageTicket = ({ ticketId }) => {
    const [ticket, setTicket] = useState(null)
    const [replies, setReplies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [replyMessage, setReplyMessage] = useState("")
    const [status, setStatus] = useState("")

    // Fetch ticket details
    const fetchTicket = async () => {
        try {
            const token = localStorage.getItem("token") // Admin token
            const res = await axios.post('http://localhost:4500/admin_reply/specific', // The backend endpoint
                { token, id: ticketId }, // sent in body
            )
            setTicket(res.data.ticket)
            setReplies(res.data.replies || [])
        } catch (err) {
            setError("Failed to fetch ticket details.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTicket()
    }, [ticketId])

    // Handle reply
    const handleReply = async () => {
        if (!replyMessage.trim()) return

        try {
            const token = localStorage.getItem("token")
            await axios.post('http://localhost:4500/admin_reply/reply',
                { token, ticketId, message: replyMessage }
            )
            setReplyMessage("")
            fetchTicket() // reload after reply
        } catch (e) {
            alert("Failed to send reply.")
        }
    }

    // Handle status update
    const handleStatusUpdate = async () => {
        if (!status) return

        try {
            const token = localStorage.getItem("token")
            await axios.post('http://localhost:4500/admin_reply/update',
                { token, ticketId, status }, // body-based
            )
            setStatus("")
            fetchTicket() // reload after update
        } catch (e) {
            alert("Failed to update status.")
        }
    }

    if (loading) return <p>Loading ticket...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!ticket) return <p>No ticket found.</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Ticket Details</h2>
            <p><strong>User:</strong>{ticket.name} ({ticket.email})</p>
            <p><strong>Message:</strong>{ticket.message}</p>
            <p><strong>Status:</strong>{ticket.status}</p>

            {/* Replies Section */}
            <h3>Replies</h3>
            {replies.length === 0 ? (
                <p>No replies yet.</p>
            ) : (
                <ul>
                    {replies.map((r) => (
                        <li key={r._id}>
                            <strong>Admin:</strong> {r.message}{" "}
                            <em>({new Date(r.createdAt).toLocaleString()})</em>
                        </li>
                    ))}
                </ul>
            )}

            {/* Reply Form */}
            <div style={{ marginTop: "20px" }}>
                <h3>Reply to Ticket</h3>
                <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows="3"
                cols="50"
                />
                <br />
                <button onClick={handleReply}>Send Reply</button>
            </div>

            {/* Status Update */}
            <div style={{ marginTop: "20px" }}>
                <h3>Update Status</h3>
                <select value={status}onChange={(e) => setStatus(e.target.value)}>
                    <option value="">-- Select --</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
                <button onClick={handleStatusUpdate}>Update</button>
            </div>    
        </div>
    )
}

export default ManageTicket