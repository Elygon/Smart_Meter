import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const MyTicket = () => {
    const {id} = useParams() // get ticket id from URL
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem('token') // get token from login
                const res = await axios.post(`http://localhost:4500/user_contact/view/${id}`, // backend route
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            
            setTicket(res.data) 
            } catch (e) {
                console.error("Error fetching ticket:", err)
                setError("Failed to load ticket.")
            } finally {
                setLoading(false)
            }
        }
        
        fetchTicket()
    }, [id])

    if (loading) return <p>Loading your ticket...</p>
    if (error) return <p>{error}</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Ticket Details</h2>
            {ticket ? (
                <div>
                    <p><strong>Reason:</strong>{ticket.reason}</p>
                    <p><strong>Message:</strong>{ticket.message}</p>
                    <p><strong>Status:</strong>{ticket.status}</p>
                    <p><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

                    <h3>Replies</h3>
                    {ticket.replies && ticket.replies.length > 0 ? (
                        <ul>
                            {ticket.replies.map((reply) => (
                                <li key={reply._id}>
                                    {reply.message} <br />
                                    <em>- Admin on {new Date (reply.createdAt).toLocaleString()}</em>
                                    </li>
                                ))}
                            </ul>
                    ) : (
                        <p>No replies yet.</p>
                    )}
                </div>
            ) : (
                <p>Ticket not found.</p>
            )}
        </div>
    )
}

export default MyTicket