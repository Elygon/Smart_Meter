import React, { useEffect, useState } from "react"
import axios from "axios"
import { useLocation } from "react-router-dom"

const ManageUser = () => {
    const location = useLocation()
    const [userId, setuserId] = useState(location.state?.userId || "")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    useEffect(() => {
        if (userId) fetchUser()
    }, [userId])

    const fetchUser = async () => {
        setError("")
        setUser(null)
        setLoading(true)

        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/admin_user/user", { token, userId })
            setUser(res.data.user)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.msg || "Failed to fetch user details. Try again.")
        } finally {
            setLoading(false)
        }
    }

     return (
        <div className="flex min-h-screen bg-gray-50">
          {/* Left panel */}
          <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
            <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
            <p className="text-gray-400 text-center max-w-md leading-relaxed">
              View detailed information about this registered user.
            </p>
          </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            View User details
          </h2>
                    
          {loading && <p className="text-blue-600 text-center">Loading user...</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    
          {user ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Full Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Gender</th>
                    <th className="px-4 py-2 border-b text-left">Joined</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{user.fullname}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.phone_no || "—"}</td>
                    <td className="px-4 py-2 border-b">{user.gender || "N/A"}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td
                      className={`px-4 py-2 border-b font-medium ${
                        user.status === "Inactive" ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {user.status || "Active"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : !loading && (
                        <p className="text-gray-500 text-center mt-4">No user registered.</p>
                    )}
                </div>
            </div>
         </div>
    )
}

export default ManageUser