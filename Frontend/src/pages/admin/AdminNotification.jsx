import React, { useEffect, useState } from "react"
import axios from "axios"

const AdminNotification = ({ notificationId, goBack }) => {
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [edit, setEdit] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  })

  const fetchNotification = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post("http://localhost:4500/admin_notication/single", {
        token,
        id: notificationId,
      })
      setNotification(res.data)
      setFormData({
        title: res.data.title,
        message: res.data.message,
        type: res.data.type,
      })
    } catch (e) {
      setError("Error fetching notification details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotification()
  }, [notificationId])

  const handleDelete = async () => {
    if (!window.confirm("Delete this notification?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.post("http://localhost:4500/admin_notication/delete", {
        token,
        notificationIds: notificationId,
      })
      goBack()
    } catch (e) {
      alert("Failed to delete notification.")
    }
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("http://localhost:4500/admin_notication/update", {
        token,
        notificationId,
        ...formData,
      })
      setEdit(false)
      fetchNotification()
    } catch (e) {
      alert("Failed to update notification.")
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
        <p>Loading notification...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <p>{error}</p>
      </div>
    )

  if (!notification)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
        <p>No notification found.</p>
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Dark Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          View, edit, or delete existing notifications sent to members of the platform. 
          Keep communication accurate and up-to-date.
        </p>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Notification Details
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {edit ? "Update notification details below." : "View the details below."}
          </p>

          {edit ? (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="info">Info</option>
                  <option value="alert">Alert</option>
                  <option value="warning">Warning</option>
                  <option value="update">Update</option>
                </select>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-[#0f172a] text-white py-2 rounded-xl font-semibold hover:bg-[#1e293b] transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-xl font-semibold hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-gray-800">Title:</span>{" "}
                {notification.title}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Type:</span>{" "}
                {notification.type}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Message:</span>{" "}
                {notification.message}
              </p>
            </div>
          )}

          {/* Bottom Buttons */}
          <div className="flex justify-between gap-3 mt-6">
            {!edit && (
              <button
                onClick={() => setEdit(true)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Update
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={goBack}
              className="flex-1 bg-gray-600 text-white py-2 rounded-xl font-semibold hover:bg-gray-700 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotification
