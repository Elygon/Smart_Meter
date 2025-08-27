import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ManageUser = ({ userId }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token") // Admin token
                const res = await axios.post('http://localhost:4500/admin_user/user', // The backend endpoint
                    { token, id: userId }, // send id in body
                )
                setUser(res.data)
            } catch (err) {
                setError("Failed to fetch user details.")
            } finally {
                setLoading(false)
            }
        }
        
        fetchUser()
    }, [userId])

    if (loading) return <p>Loading user...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>
    if (!user) return <p>No user found.</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>User Details</h2>
            <ul>
                <li><strong>Name:</strong>{user.fullname}</li>
                <li><strong>Email:</strong>{user.email}</li>
                <li><strong>Phone:</strong>{user.phone_no}</li>
                <li><strong>Role:</strong>{user.role}</li>
                <li><strong>Gender:</strong>{user.gender || "N/A"}</li>
                <li><strong>Joined:</strong> {newDate(user.createdAt).toLocaleDateString()}</li>
            </ul>
        </div>
    )
}

export default ManageUser