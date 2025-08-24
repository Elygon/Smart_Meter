import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
      e.preventDefault()

      try {
        const response = await axios.post('http://localhost:4500/admin_auth/login', {
          email,
          password
        })

        // Save token and role
        const { token } = localStorage.setItem("token", token)
        
        // Navigate to admin dasdashboard
        navigate("/admin/dashboard")
      } catch (err) {
        setError(err.response?.data?.msg || "Login failed")
      }
    }

    return (
      <div style={styles.container}>
        <h1>Admin Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
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


/*
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [gender, setGender] = useState('')
    const [message, setMessage] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
          const res = await fetch('http://localhost:4500/admin_auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                fullname,
                email,
                password,
                phone_no: phoneNo,
                gender
            })
          })
    
          const data = await res.json()

          if (res.ok) {
            setMessage("Registration successful! Redirecting to login...")
            setTimeout(() => navigate("/admin/login"), 2000)
          } else {
            setMessage(data.msg || "Registration failed.")
          }
        } catch (e) {
            console.error('Error registering:', err)
            setMessage('An error occurred. Please try again.')
        }
      }

      return (
        <div style={{maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <h2>Register</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleRegister}>
            <input
             type="text"
             placeholder="Full Name"
             value={fullname}
             onChange={(e) => setFullname(e.target.value)}
             required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <button type="submit">Register</button>
        </form>
        <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
            >
                Login
            </span>
        </p>
        </div>
    )
}

export default Register
*/