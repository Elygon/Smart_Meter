import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CreateNotification = () => {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType]= useState("")
    const [target, setTarget] = useState("all") // "all" or "single"
    const [userId, setUserId] = useState("") // used if target = "single"
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const payload = target === "all" ? { token, title, message, type, all: true} :
            { token, user_id: userId, title, message, type }

            await axios.post('http://localhost:4500/admin_notication/send', payload, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setSuccess("Notification sent successfully!")
            setTitle("")
            setMessage("")
            setUserId("")
            setType("info")
        } catch (e) {
            setError('Failed to send notification.')
        } finally {
            setLoading(false)
        }
    }
        

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create Notification</h2>
            <p>Send a notification to all users or a specific user.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title: </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Message: </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Type: </label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="info">Info</option>
                        <option value="alert">Alert</option>
                        <option value="warning">Warning</option>
                        <option value="update">Update</option>
                    </select>
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Target: </label>
                    <select value={type} onChange={(e) => setTarget(e.target.value)}>
                        <option value="all">All Users</option>
                        <option value="single">Single User</option>
                    </select>
                </div>

                {target === "single" && (
                    <div style={{ marginTop: "10px" }}>
                        <label>User ID: </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter user ID"
                            required
                        />
                    </div>
                )}
                    
                <div style={{ marginTop: "10px" }}>
                    <button type="submit"disabled={loading}>
                        {loading ? "Sending..." : "Send Notification"}
                    </button>
                </div>
            </form>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default CreateNotification 