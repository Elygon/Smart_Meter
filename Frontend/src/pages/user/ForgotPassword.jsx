import React, { useState } from "react"
import axios from "axios"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const res = await axios.post("http://localhost:4500/user_auth/forgot_password", { email })

      if (res.status === 200) {
        setStatus(
          res.data.msg || "Password reset link has been sent to your email."
        )
        setEmail("")
      }
    } catch (error) {
      console.error("Error sending password reset:", error)
      setStatus("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Forgot your password? Don't worry — enter your registered email and
          we'll send you a link to reset it securely.
        </p>
      </div>

      {/* Right side (form) */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your registered email address to reset your password
          </p>

          {/* Status Message */}
          {status && (
            <p
              className={`text-center mb-4 font-medium ${
                status.toLowerCase().includes("sent")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword