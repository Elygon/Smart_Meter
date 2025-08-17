import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const SignUp = () => {
    const navigate = useNavigate()
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [gender, setGender] = useState('')
    const [error, setError] = useState('')

    const handleSignUp = async (e) => {
        e.preventDefault()

        try {
          const res = await api.post('/user_auth/signup', {
            fullname,
            email,
            password,
            phone_no: phoneNo,
            gender
          })
    
          if (res.status === 200 || res.data.msg) {
          alert("Signup successful! Please login.")
          navigate("/user/login")
          }
        } catch (e) {
          setError(err.res?.data?.msg || 'Something went wrong.')
        }
      }

      return (
        <div style={{maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <h2>Sign Up</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSignUp}>
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
            <button type="submit">Sign Up</button>
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

export default SignUp