import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MyTickets = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token') // get token from login
                const res = await axios.post("http://localhost:4500/user_contact/all", // adjust to your backend route
                    { token }
                )
                setTickets(res.data) // assuming backend returns an array
                } catch (e) {
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
                            {ticket.subject} - {ticket.status}{" "}
                            <button onClick={() => navigate("/user/MyTicket", { state: { ticketId: ticket._id } })}>
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MyTickets