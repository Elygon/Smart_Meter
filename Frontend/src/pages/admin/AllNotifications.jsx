import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const navigate = useNavigate()

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        "http://localhost:4500/admin_notification/view",
        { token }
      )
      setNotifications(res.data.notifications || [])
    } catch (e) {
      setError("Error fetching notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("No notifications selected.")
      return
    }

    if (!window.confirm("Delete selected notifications?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://localhost:4500/admin_notification/delete",
        {
          token,
          notificationIds: selectedIds,
        }
      )
      setSelectedIds([])
      fetchNotifications()
      setSuccessMsg("Notifications deleted successfully!")
    
      // Give the user a few seconds to see the message before going back
      setTimeout(() => {
      goBack()
      setSuccessMsg("")
      }, 3000) // 3 seconds
    } catch (e) {
      alert("Failed to delete notifications.")
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Loading notifications...
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-lg">
        {error}
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel */}  
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-16 rounded-r-3xl space-y-6">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Admin Notifications
        </h1>
        <p className="text-gray-300 text-center max-w-sm leading-relaxed">
          View, manage and delete notifications sent to users. Create new notifications or 
          manage existing alerts and announcements.
        </p>
      </div>


      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">

          {successMsg && (
              <p className="text-green-600 text-center mb-4 font-medium">
                {successMsg}
              </p>
            )}
            
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
              Manage Notifications
            </h2>

            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                onClick={() => navigate("/admin/CreateNotification")}
                className="bg-[#0f172a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition"
              >
                + Create Notification
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  selectedIds.length === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Delete Selected
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Select</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Message</th>
                    <th className="py-3 px-4 text-left">Created At</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notifications.map((n) => (
                    <tr key={n._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(n._id)}
                          onChange={() => toggleSelect(n._id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-2 px-4 font-medium text-gray-800">{n.title}</td>
                      <td className="py-2 px-4 text-gray-600 capitalize">{n.type}</td>
                      <td className="py-2 px-4 text-gray-600">
                        {n.message.length > 40 ? `${n.message.substring(0, 40)}...` : n.message}
                      </td>
                      <td className="py-2 px-4 text-gray-500 text-sm">{new Date(n.createdAt).toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => 
                            navigate("/admin/admin-notification", { 
                              state: { notificationId: n._id } })
                            }
                          className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm px-4 py-2 rounded-lg transition"
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
    </div>
  )
}

export default AllNotifications
