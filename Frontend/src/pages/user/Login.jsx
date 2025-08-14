import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const UserLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
      e.preventDefault()

      try {
        const res = await api.post('/user_auth/login', { email, password })
        localStorage.setItem('token', res.data.token) // Save token for future requests

        navigate('/user/dashboard') // Redirect to dashboard
      } catch (e) {
        console.log('Login failed:', err.response?.data || err.message)
      }
    }

    return (
      <div style={styles.container}>
        <h1>User Login</h1>
        <form onSubmit={handleLogin}style={styles.form}>
          <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
          />
          <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {/* Forget Password Link */}
        <p style={{ marginTop: "10px" }}>
          <Link to="/user/forgot-password">Forgot Password? Click here</Link>
        </p>
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
          
export default UserLogin