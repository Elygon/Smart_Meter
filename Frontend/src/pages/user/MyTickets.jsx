import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:4500/user_contact/all", { token })
        setTickets(res.data.inquiries);
      } catch (e) {
        console.error("Error fetching tickets:", e)
        setError("Failed to load tickets. Try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading your tickets...</p>
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
      {/* Left dark panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          View all your submitted support tickets and easily access their details and replies.
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            My Tickets
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Below are your submitted tickets and their current statuses.
          </p>

          {tickets.length === 0 ? (
            <p className="text-gray-600 text-center">No tickets found.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {ticket.subject || "No Subject"}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          ticket.status === "open"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {ticket.status || "Unknown"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/user/MyTicket", {
                          state: { ticketId: ticket._id },
                        })
                      }
                      className="px-4 py-2 bg-[#0f172a] text-white text-sm rounded-lg hover:bg-[#1e293b] transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
