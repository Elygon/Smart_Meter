import React, { useState, useEffect } from 'react'
import axios from 'axios'

const MyTickets = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token') // get token from login
                const res = await axios.post("http://localhost:4500/user_contact/all", // adjust to your backend route
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            
            setTickets(res.data) // assuming backend returns an array
            } catch (e) {
                console.error("Error fetching tickets:", err)
                setError("Failed to load tickets. Try again later.")
            } finally {
                setLoading(false)
            }
        }
        
        fetchTickets()
    }, [])

    if (loading) return <p>Loading your tickets...</p>
    if (error) return <p>{error}</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Tickets</h2>
            {tickets.length === 0 ? (
                <p>No tickets found.</p>
            ) : (
                <ul>
                    {tickets.map((ticket) => (
                        <li key={ticket._id}>
                            <strong>{ticket.status}</strong> <br />
                            {ticket.message} <br />
                            <em>Status: {ticket.status}</em>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MyTickets