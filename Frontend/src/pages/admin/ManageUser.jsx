import React, { useEffect, useState } from "react"
import axios from "axios"

const ManageUser = ({ userId, goBack }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") // Admin token
        const res = await axios.post("http://localhost:4500/admin_user/user", {
          token,
          id: userId,
        })
        setUser(res.data)
      } catch (err) {
        setError("Failed to fetch user details.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        Loading user details...
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-lg">
        {error}
      </div>
    )

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        No user found.
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 sm:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          User Details
        </h2>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Full Name:</span>
            <span>{user.fullname}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Phone:</span>
            <span>{user.phone_no || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Role:</span>
            <span className="capitalize">{user.role}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Gender:</span>
            <span>{user.gender || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Joined:</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-800">Status:</span>
            <span
              className={`font-medium ${
                user.status === "Inactive" ? "text-red-500" : "text-green-600"
              }`}
            >
              {user.status || "Active"}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={goBack}
            className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-6 py-2 rounded-lg shadow-md transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageUser
