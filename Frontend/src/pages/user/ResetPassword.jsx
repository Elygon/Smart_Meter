import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
    const { token } = useParams()  //Get token from URL
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const handleReset = async (e) => {
      e.preventDefault()
      setError('')
      setMessage('')
      

      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match!")
        return
      }

      try {
        const res = await axios.post(`http://localhost:4500/user_auth/reset_password/${token}`,
          { password: newPassword }
        )

        if (res.status === 200) {
          setMessage(res.data.msg || "Password reset successful!. Redirecting to login... ")

          // Redirect to login after 3 seconds
          setTimeout(() => navigate("/user/login"), 3000)
        }
      } catch (err) {
        setError(err.res?.data?.msg || 'Error connecting to server.')
      }
    }

    return (
      <div style={{ padding: "20px", maxwidth: "400px", margin: "auto" }}>
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}


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