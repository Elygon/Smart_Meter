import { useState } from 'react'
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleForgotPassword = async (e) => {
      e.preventDefault()

      try {
        const res = await axios.post('http://localhost:4500/user_auth/forgot_password', {
          email,
        })

        if (res.status === 200) {
          setMessage(res.data.msg || "Password reset instructions have been sent to your email.")
        }
      } catch (e) {
        setError(error.response?.data?.msg || "Something went wrong")
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


// Simple inline styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '400px',
      margin: 'auto',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    input: {
      padding: '10px',
      fontSize: '16px'
    },
    button: {
      padding: '10px',
      background: '#4CAF50',
      color: 'white',
      border:'none',
      fontSize: '16px',
      cursor: 'pointer'
    }
}

export default ForgotPassword