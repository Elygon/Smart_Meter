import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'rect-router-dom'

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token") // admin token
                const res = await axios.post('http://localhost:4500/admin_user/users',{
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsers(res.data)
            } catch (e) {
                setError('Error fetching users.')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])


    if (loading) return <p>Loading users...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Users</h2>
            
            {users.length === 0 ? (
                <p>No users found.</p>
            ) :(
                <table border="1" cellPadding="8"style={{ marginTop: "20px", width: "100% "}}>
                    <thead>
                        <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone_No</th>
                        <th>Role</th>
                        <th>Status</th> {/* Shows account state */}
                        <th>Action</th> {/* Shows admin actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.status || "Active"}</td> {/* default to Active if no status */}
                                <td><Link to={`/admin/user/${user._id}`}>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ManageUsers