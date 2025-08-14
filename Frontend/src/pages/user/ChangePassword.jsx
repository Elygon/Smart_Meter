import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChangePassword = async (e) => {
      e.preventDefault()

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage("All fields are required.")
        return
      }

      if (newPassword !== confirmPassword) {
        setMessage("New passwords do not match")
        return
      }

      try {
        const token = localStorage.getItem("token") // User's JWT token
        if (!token) {
            setMessage("You must be logged in to change password.")
            return
        }

        const res = await fetch('http://localhost:4500/user_auth/change-password', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json}",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        })

        const data = await res.json()

        if (res.ok) {
          setMessage("Password changed successfully!")

          // Redirect to login after 3 seconds
          setTimeout(() => navigate("/user/login"), 3000)
        } else {
          setMessage(data.msg || "Error changing password.")
        }
      } catch (e) {
        setMessage('Something went wrong. Try again')
      }
    }

    return (
      <div style={{ padding: "20px", maxwidth: "400px", margin: "auto" }}>
        <h2>Change Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleChangePassword}>
            <label>Current Password:</label>
            <input
            type="password"
            value={currentPassword}
            onChange={(e) =>setCurrentPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
            <label>New Password:</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) =>setNewPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
            <label>Confirm New Password:</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
            />
          <button type="submit"style={{ width: "100%" }}>Update Password</button>
        </form>
      </div>
    )
}

export default ChangePassword