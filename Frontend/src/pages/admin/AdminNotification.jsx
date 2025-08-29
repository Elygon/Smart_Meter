import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminNotification = ({ notificationId, goBack }) => {
    const [notification, setNotification] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [edit, setEdit] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "info"
    })

    // Fetch notification details
    const fetchNotification = async () => {
        try {
            const token = localStorage.getItem("token") // admin token
            const res = await axios.post('http://localhost:4500/admin_notication/single',
                { token, id: notificationId }
            )
            setNotification(res.data)
            setFormData({
                title: res.data.title,
                message: res.data.message,
                type: res.data.type
            })
        } catch (e) {
            setError('Error fetching notification details.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotification()
    }, [notificationId])

    // Delete notification
    const handleDelete = async () => {
        if (!window.confirm("Delete this notification?")) return

        try {
            const token = localStorage.getItem("token") // admin token
            await axios.post('http://localhost:4500/admin_notication/delete',
                { token, notificationIds: notificationId }
            )
            goBack() // return to AllNotifications list after delete
        } catch (e) {
            alert('Failed to delete notification.')
        }
    }

    // Update notification
    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token") // admin token
            await axios.post('http://localhost:4500/admin_notication/update',
                { token, notificationId, ...formData }
            )
            setEdit(false)
            fetchNotification() // refresh after update
        } catch (e) {
            alert('Failed to update notification.')
        }
    }

    if (loading) return <p>Loading notification...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!notification) return <p>No notification found.</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Notification Details</h2>

            {edit ? (
                <div>
                    <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => 
                        setFormData({ ...formData, title: e.target.value })
                    }
                    />
                    <textarea
                    value={formData.message}
                    onChange={(e) => 
                        setFormData({ ...formData, message: e.target.value })
                    }
                    />
                    <select
                    value={formData.type}
                    onChange={(e) => 
                        setFormData({ ...formData, type: e.target.value })
                    }
                    >
                        <option value="info">Info</option>
                        <option value="alert">Alert</option>
                        <option value="warning">Warning</option>
                        <option value="update">Update</option>
                    </select>
                    <br />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEdit(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p><strong>Title:</strong>{notification.title}</p>
                    <p><strong>Type:</strong>{notification.type}</p>
                    <p><strong>Message:</strong>{notification.message}</p>
                </div>
            )}
            
            <div style={{ marginTop: "20px" }}>
                {!edit && <button onClick={() => setEdit(true)}> Update</button>}
                <button onClick={handleDelete}style={{ marginLeft: "10px" }}>
                    Delete
                </button>
                <button onClick={goBack}style={{ marginLeft: "10px" }}>
                    Back
                </button>
            </div>
        </div>
    )
}

export default AdminNotification