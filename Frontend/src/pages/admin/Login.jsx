import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios" // same axios instance for admin

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await api.post("/admin_auth/login", { email, password })

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        navigate("/admin/dashboard")
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (e) {
      setError(e.response?.data?.msg || "Something went wrong.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left section (dark side info) */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay Admin</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Manage users, monitor transactions, control announcements, and ensure
          smooth system operations — all from the admin dashboard.
        </p>
      </div>

      {/* Right section (login card) */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Admin 👋
          </h2>
          <p className="text-gray-500 mb-6">Login to your dashboard</p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <Link
              to="/admin/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
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