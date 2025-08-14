import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const { token } = useParams()  //Get token from URL
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleReset = async (e) => {
      e.preventDefault()

      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match!")
        return
      }

      try {
        const res = await fetch('http://localhost:4500/user_auth/reset-password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ token, // token from the URL params
          password: newPassword })
        })

        const data = await res.json()

        if (res.ok) {
          setMessage("Password reset successful! Redirecting... ")

          // Redirect to login after 3 seconds
          setTimeout(() => navigate("/user/login"), 3000)
        } else {
          setMessage(data.msg || "Password reset failed.")
        }
      } catch (e) {
        setMessage('Error connecting to server.')
      }
    }

    return (
      <div style={{ padding: "20px", maxwidth: "400px", margin: "auto" }}>
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleReset}>
          <div>
            <label>New Password:</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) =>setNewPassword(e.target.value)}
            required
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    )
}

export default ResetPassword