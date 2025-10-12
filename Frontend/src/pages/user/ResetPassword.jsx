import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const ResetPassword = () => {
  const { token } = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!")
      return
    }

    try {
      const res = await axios.post(`http://localhost:4500/user_auth/reset_password/${token}`, {
        password: newPassword,
      })

      if (res.status === 200) {
        setMessage(res.data.msg || "Password reset successful! Redirecting to login...")
        setTimeout(() => navigate("/user/login"), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Error connecting to server.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left dark panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Secure your PowerPay account by resetting your password.
          Choose a strong and unique password to protect your access.
        </p>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Reset Password
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter and confirm your new password to regain access
          </p>

          {message && (
            <p className="text-center text-green-600 mb-4 font-medium">{message}</p>
          )}
          {error && (
            <p className="text-center text-red-600 mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
