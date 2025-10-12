import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ManageTickets = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem("token") // admin token
                const res = await axios.post('http://localhost:4500/admin_reply/all',{
                    token 
                })
                setTickets(res.data)
            } catch (e) {
                setError('Error fetching tickets.')
            } finally {
                setLoading(false)
            }
        }

        fetchTickets()
    }, [])


    if (loading) return <p>Loading tickets...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (tickets.length === 0) return <p>No tickets found.</p>
    

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Inquiry Tickets</h2>
            
            {tickets.length === 0 ? (
                <p>No tickets found.</p>
            ) :(
                <table border="1" cellPadding="8"style={{ marginTop: "20px", width: "100% "}}>
                    <thead>
                        <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td>{ticket.name}</td>
                                <td>{ticket.email}</td>
                                <td>{ticket.message.slice(0, 30)}...</td>
                                <td>{ticket.status}</td>
                                <td>
                                    <button onClick={() => navigate("/admin/ManageTicket", { state: { ticketId: ticket._id} })}>
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

export default ManageTickets