import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const navigate = useNavigate()

    const token = localStorage.getItem("token")  // get token from storage

    // Fetch all notifications on page load
    useEffect(() => {
        if (!token) {
            navigate("/user/login") // redirect if no token
            return
        }

        fetch("http://localhost:4500/user_notification/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token }) // send token in body
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {setNotifications(data.notifications || [])
            } else {
              alert(data.msg || "Failed to load notifications")
            }
        })
        .catch((e) => console.error("Error fetching notifications:", err))
    }, [token, navigate])

    // Fetch a single notification when clicked
    const viewNotification = (id) => {fetch(`http://localhost:4500/user_notification/single`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, notificationId: id }) // token + id in body
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {setSelectedNotification(data.notification)
        } else {
            alert(data.msg || "Failed to load notification")
        }
    })
    .catch((e) => console.error("Error fetching single notification:", err))
}

return (
    <div style={{ padding: '20px' }}>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
            <p>No notifications found.</p>
        ) : (
            <ul>
                {notifications.map((note) => (
                    <li
                    key={note._id}
                    onClick={() => viewNotification(note._id)}
                    style={{
                        cursor: "pointer",
                        padding: "10px",
                        borderBottom: "1px solid #ccc"
                    }}
                    >
                        <strong>{note.title}</strong> - {newDate(note.createdAt).toLocaleString()}
                    </li>
                ))}
            </ul>
        )}

        {/* Single notification view */}
        {selectedNotification && (
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc "}}>
              <h3>{selectedNotification.title}</h3>
              <p>{selectedNotification.message}</p>
              <small>{newDate(selectedNotification.createdAt).toLocaleString()}</small>
              <br />
              <button style={{ marginTop: "10px" }} onClick={() => setSelectedNotification(null)}>
                Close
              </button>
            </div>
        )}
        </div>
    )
}

export default Notification