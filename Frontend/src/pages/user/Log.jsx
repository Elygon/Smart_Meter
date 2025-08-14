import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Log = () => {
    const [logs, setLogs] = useState([])
    const [selectedLog, setSelectedLog] = useState(null)
    const navigate = useNavigate()

    const token = localStorage.getItem("token")  // get token from storage

    // Fetch all notifications on page load
    useEffect(() => {
        if (!token) {
            navigate("/user/login") // redirect if no token
            return
        }

        fetch("http://localhost:4500/user_log/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token }) // send token in body
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {setLogs(data.logs || [])
            } else {
              alert(data.msg || "Failed to load logs")
            }
        })
        .catch((e) => console.error("Error fetching logs:", err))
    }, [token, navigate])

    // Fetch a single log details
    const viewLog = (id) => {fetch(`http://localhost:4500/user_log/view`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, logId: id }) // token + logId
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {setSelectedLog(data.log)
        } else {
            alert(data.msg || "Failed to load log details")
        }
    })
    .catch((e) => console.error("Error fetching single log:", err))
}

return (
    <div style={{ padding: '20px' }}>
        <h2>Usage Logs</h2>
        {logs.length === 0 ? (
            <p>No logs found.</p>
        ) : (
            <ul>
                {logs.map((log) => (
                    <li
                    key={log._id}
                    onClick={() => viewLog(log._id)}
                    style={{
                        cursor: "pointer",
                        padding: "10px",
                        borderBottom: "1px solid #ccc"
                    }}
                    >
                        <strong>{log.event}</strong> - {log.status} | {" "}
                        {newDate(log.createdAt).toLocalestring()}
                    </li>
                ))}
            </ul>
        )}

        {/* Single log details */}
        {selectedLog && (
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc "}}>
              <h3>{selectedLog.event}</h3>
              <p>Status: {selectedLog.status}</p>
              <p>Balance: {selectedLog.balance} kWh</p>
              <p>Energy Usage: {selectedLog.energyUsage} kWh</p>
              <p>Description: {selectedLog.description}</p>
              <small>{newDate(selectedLog.createdAt).toLocaleString()}</small>
              <br />
              <button style={{ marginTop: "10px" }} onClick={() => setSelectedLog(null)}>
                Close
              </button>
            </div>
        )}
        </div>
    )
}

export default Log