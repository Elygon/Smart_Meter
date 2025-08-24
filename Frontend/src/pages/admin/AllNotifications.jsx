import React, { useEffect, useState } from 'react'
import { useNavigate } from 'rect-router-dom'
import axios from 'axios'

const AllNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedIds, setSelectedIds] = useState([]) // track selected notifications
    const navigate = useNavigate()

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token") // admin token
            const res = await axios.post('http://localhost:4500/admin_notication/view',{
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(res.data)
        } catch (e) {
            setError('Error fetching notifications.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    // Handle select/unselect notification
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
        )
    }

    // Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("No notifications selected.")
            return
        }
            if (!window.confirm("Delete selected notifications?")) return

        try {
            const token = localStorage.getItem("token") // admin token
            await axios.post('http://localhost:4500/admin_notication/delete',{
                headers: { Authorization: `Bearer ${token}` },
                data: { notificationIds: selectedIds } // send all IDs in body
            })
            
            setSelectedIds([]) // clear selection
            fetchNotifications()
            } catch (e) {
                alert('Failed to delete notifications.')
            }
        }
        
        if (loading) return <p>Loading notificationss...</p>
        if (error) return <p style={{ color: "red" }}>{error}</p>

        return (
            <div style={{ padding: "20px" }}>
                <h2>Manage Notifications</h2>
                
                <button onClick={() => navigate("/admin/notification/send")}>
                + Create Notification
                </button>

                <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                style={{ marginLeft: "10px" }}>
                    Delete Selected
                </button>
                
                {notifications.length === 0 ? (
                    <p>No notificationss found.</p>
                ) :(
                  <table border="1" cellPadding="8"style={{ marginTop: "20px", width: "100% "}}>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Message</th>
                            <th>Created By</th>
                            <th>Created At</th>
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((n) => (
                            <tr key={n._id}>
                                <td>
                                    <input
                                    type="checkbox" checked={selectedIds.includes(n._id)}
                                    onChange={() => toggleSelect(n._id)}
                                    />
                                </td>
                                <td>{n.title}</td>
                                <td>{n.type}</td>
                                <td>{n.message.substring(0, 40)}...</td>
                                <td>{n.createdBy}</td>
                                <td>{newDate(n.createdAt).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/notifications/${n._id}`)}>
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

export default AllNotifications