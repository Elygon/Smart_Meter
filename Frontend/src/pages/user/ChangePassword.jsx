import React, { useState } from 'react'
import axios from 'axios'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChangePassword = async (e) => {
      e.preventDefault()
      setError('')
      setMessage('')

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage("All fields are required.")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match")
        return
      }

      try {
        const token = localStorage.getItem("token") // User's JWT token   

        const res = await axios.post('http://localhost:4500/user_auth/change-password',
          { currentPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        )

        if (res.status === 200) {
          setMessage(res.data.msg || "Password changed successfully!")
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }
      } catch (e) {
        setError(error.res?.data?.msg || 'Something went wrong. Try again')
      }
    }

    return (
      <div style={{ padding: "20px", maxwidth: "400px", margin: "auto" }}>
        <h2>Change Password</h2>
        <p>Update your account password securely.</p>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleChangePassword}>

          <div>
          <label>Current Password:</label>
            <input
            type="password"
            value={currentPassword}
            onChange={(e) =>setCurrentPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>

          <div>
          <label>New Password:</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) =>setNewPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>

          <div>
          <label>Confirm New Password:</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>

          <button type="submit"style={{ width: "100%" }}>Update Password</button>
        </form>
      </div>
    )
}

export default ChangePassword