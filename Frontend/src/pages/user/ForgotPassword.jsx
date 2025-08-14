import { useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleForgotPassword = async (e) => {
      e.preventDefault()

      try {
        const res = await fetch('http://localhost:4500/user_auth/forgot-password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email })
        })

        const data = await res.json()

        if (res.ok) {
          setMessage("Password reset instructions have been sent to your email.")
        } else {
          setMessage(data.msg || "Failed to send reset email.")
        }
      } catch (e) {
        console.error("Error:", err)
        setMessage('An error occurred. Please try again.')
      }
    }

    return (
      <div>
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    )
}

export default ForgotPassword