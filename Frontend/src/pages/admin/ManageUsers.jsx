import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token") // admin token
        const res = await axios.post("http://localhost:4500/admin_user/users", { token })
        setUsers(res.data)
      } catch (e) {
        setError("Error fetching users.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        Loading users...
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-lg">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 sm:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Manage Users
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Phone No</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Role</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4 text-gray-800">{user.fullname}</td>
                    <td className="py-3 px-4 text-gray-800">{user.email}</td>
                    <td className="py-3 px-4 text-gray-800">{user.phone_no || "—"}</td>
                    <td className="py-3 px-4 capitalize text-gray-700">{user.role}</td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        user.status === "Inactive"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {user.status || "Active"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          navigate("/admin/ManageUser", {
                            state: { userId: user._id },
                          })
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
