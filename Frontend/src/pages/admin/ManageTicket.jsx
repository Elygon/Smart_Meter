import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const ManageTicket = () => {
  const location = useLocation()
  const ticketId = location.state?.ticketId

  const [ticket, setTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [status, setStatus] = useState("")
  const [success, setSuccess] = useState("")


  const fetchTicket = async () => {
    if (!ticketId) {
      setError("Ticket ID not provided.")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post('http://localhost:4500/admin_reply/specific', { token, contactId: ticketId })
      setTicket(res.data.inquiry)
      setReplies(res.data.inquiry.replies || [])
    } catch (err) {
      setError("Failed to fetch ticket details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  const handleReply = async () => {
    if (!replyMessage.trim()) return
    try {
      const token = localStorage.getItem("token")
      await axios.post('http://localhost:4500/admin_reply/reply', { token, 
        contactId: ticketId,  // <- use contactId, not ticketId
        message: replyMessage 
    })
    setReplyMessage("")
    fetchTicket()
    setSuccess("Reply sent successfully!") // show success
    setTimeout(() => setSuccess(""), 5000) // hide after 5s
    } catch (e) {
      alert("Failed to send reply.")
    }
  }

  const handleStatusUpdate = async () => {
    if (!status) return
    try {
      const token = localStorage.getItem("token")
      await axios.post('http://localhost:4500/admin_reply/update', { token, 
        contactId: ticketId,  // <- use contactId
        status 
       })

      setStatus("")
      fetchTicket()
      setSuccess("Status updated successfully!") // show success
      setTimeout(() => setSuccess(""), 5000) // hide after 5s
    } catch (e) {
      alert("Failed to update status.")
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading ticket...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )

  if (!ticket) return <p>No ticket found.</p>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left dark panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-12 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white text-center">PowerPay Admin</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          View and manage a single inquiry ticket. Check the user's message, status and reply.
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ticket Details</h2>
          
          {success && (
            <div className="mb-4 text-green-600 font-semibold">
                {success}
            </div>
           )}

          <div className="mb-6">
            <p><strong>User:</strong> {ticket.user?.fullname || "—"} ({ticket.user?.email || "—"})</p>
            <p><strong>Message:</strong> {ticket.message}</p>
            <p><strong>Status:</strong> {ticket.status || "Pending"}</p>
          </div>

          {/* Replies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Replies</h3>
            {replies.length === 0 ? (
              <p className="text-gray-600">No replies yet.</p>
            ) : (
              <ul className="space-y-2">
                {replies.map((r) => (
                  <li key={r._id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <strong>Admin:</strong> {r.message}
                    <div className="text-xs text-gray-500">
                      ({new Date(r.createdAt).toLocaleString()})
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reply form */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Reply to Ticket</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
            <button
              onClick={handleReply}
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg transition"
            >
              Send Reply
            </button>
          </div>

          {/* Status update */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Update Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mr-2"
            >
              <option value="">-- Select --</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg transition"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageTicket
