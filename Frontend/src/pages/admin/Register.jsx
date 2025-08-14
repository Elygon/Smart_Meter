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