import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all notifications on page load
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:4500/user_notification/all", { token });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Fetch a single notification when clicked
  const viewNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:4500/user_notification/single", {
        token,
        notificationId: id,
      });
      setSelectedNotification(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching single notification:", err);
      setError("Failed to load notification details.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading notifications...</p>
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
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Stay informed about updates, alerts, and important information
          regarding your account and service.
        </p>
      </div>

      {/* Right side (Notifications) */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Notifications
          </h2>
          <p className="text-gray-500 text-center mb-6">
            View your recent alerts and updates below.
          </p>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-600 text-center">
                No notifications available.
              </p>
            ) : (
              notifications.map((note) => (
                <button
                  key={note._id}
                  onClick={() => viewNotification(note._id)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition text-[#0f172a] font-medium shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span>{note.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Selected Notification Details */}
          {selectedNotification && (
            <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-gray-700 mb-2">
                {selectedNotification.message}
              </p>
              <em className="text-gray-500 text-sm">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </em>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
