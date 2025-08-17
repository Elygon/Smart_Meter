import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)


    // Fetch all notifications on page load
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token')
                
                    const res = await axios.post("http://localhost:4500/user_notification/all",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    )
                
                    setNotifications(res.data)
                } catch (e) {
                    console.error("Error fetching notifications:", err)
                    setError("Failed to load notifications.")
                } finally {
                    setLoading(false)
                }
            }

            fetchAll()
    }, [])

    // Fetch a single notification when clicked
    const viewNotification = async (id) => {
        try {
            const token = localStorage.getItem('token')
                const res = await axios.post(`http://localhost:4500/user_notification/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    }
                )

                setSelectedNotification(res.data)
            } catch (e) {
                console.error("Error fetching single notification:", err)
                setError("Failed to load notification details.")
            }
        }

        if (loading) return <p>Loading notifications...</p>
        if (error) return <p>{error}</p>

        return (
            <div style={{ padding: '20px' }}>
                <h2>Notifications</h2>

                {/* List of notifications */}
                <ul>
                    {notifications.map((note) => (
                        <li key={note._id}>
                            <button 
                            style={{ background: "none", border: "none", cursor: "pointer", color: "blue"}}
                                onClick={() => viewNotification(note._id)}
                                >
                                {note.title}
                            </button>
                        </li>
                    ))}
                </ul>
                
                {/* Selected notification details*/}
                {selectedNotification && (
                    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc "}}>
                        <h3>{selectedNotification.title}</h3>
                        <p>{selectedNotification.message}</p>
                        <em>{newDate(selectedNotification.createdAt).toLocaleString()}</em>
                    </div>
                )}
            </div>
    )
}

export default Notification