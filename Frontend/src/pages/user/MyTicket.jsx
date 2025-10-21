import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

const MyTicket = () => {
  const location = useLocation()
  const ticketId = location.state?.ticketId  // <-- get ticketId from the router state
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.post(
          "http://localhost:4500/user_contact/view/",
          { token, contactId: ticketId }
        )
        setTicket(res.data.ticket || res.data.inquiry)
      } catch (e) {
        console.error("Error fetching ticket:", e)
        setError("Failed to load ticket.")
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading your ticket...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left dark side */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          View your support ticket details, including the issue, admin replies,
          and current status.
        </p>
      </div>

      {/* Right side - Ticket Details */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Ticket Details
          </h2>

          {ticket ? (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p>
                  <span className="font-semibold text-gray-700">Reason:</span>{" "}
                  {ticket.reason}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Message:</span>{" "}
                  {ticket.message}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${
                      ticket.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Replies
                </h3>
                {ticket.replies && ticket.replies.length > 0 ? (
                  <ul className="space-y-3">
                    {ticket.replies.map((reply) => (
                      <li
                        key={reply._id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <p className="text-gray-800">{reply.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          - Admin on{" "}
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No replies yet.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Ticket not found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTicket
