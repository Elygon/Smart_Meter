// src/pages/admin/ManageTickets.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token"); // admin token
        const res = await axios.post('http://localhost:4500/admin_reply/all', { token });
        setTickets(res.data?.inquiries || []);
      } catch (e) {
        setError('Error fetching tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading tickets...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left dark panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-12 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white text-center">PowerPay Admin</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Manage all inquiry tickets submitted by users. Check status and respond efficiently.
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Manage Inquiry Tickets
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Below are all submitted inquiry tickets from users.
          </p>

          {tickets.length === 0 ? (
            <p className="text-gray-600 text-center py-10">No tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold">User</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Message</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket._id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                    >
                      <td className="py-3 px-4 text-gray-800">{ticket.user?.fullname || "—"}</td>
                      <td className="py-3 px-4 text-gray-800">{ticket.user?.email || "—"}</td>
                      <td className="py-3 px-4 text-gray-800">{ticket.message.slice(0, 30)}...</td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {ticket.status || "Pending"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate("/admin/ManageTicket", { state: { ticketId: ticket._id } })}
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

export default ManageTickets
