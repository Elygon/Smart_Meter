import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
      e.preventDefault()
      console.log("Email:", email)
      console.log("Password:", password)

      try {
        const response = await fetch('http://localhost:4500/admin_auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (response.ok) {
          console.log("Token:", data.token)

          // Store token and admin info in localStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('admin', JSON.stringify(data.admin))

          // Navigate to dashboard
          navigate('/user/dashboard')
        } else {
          alert(data.msg || 'Login failed')
        }
      } catch (e) {
        console.error("Error logging in:", err)
        alert('An error occurred during login.')
      }
    }

    return (
      <div style={styles.container}>
        <h1>Admin Login</h1>
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
          <Link to="/admin/forgot-password">Forgot Password? Click here</Link>
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
          
export default AdminLogin