import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Log = () => {
    const [logs, setLogs] = useState([])
    const [selectedLog, setSelectedLog] = useState(null)
    const [token] = useState(localStorage.getItem("token") || "")
    const [message, setMessage] = useState("")


    // Fetch all logs on page load
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.post("http://localhost:4500/user_log/all",
                    { token }
                )
                setLogs(res.data || [])
            } catch (e) {
                console.error("Error fetching logs:", err)
                setMessage("Failed to fetch logs. Try again.")
            }
        }
        
        fetchLogs()
    }, [token])

    // Fetch a single log when clicked
    const viewLog = async (logId) => {
        try {
            const res = await axios.post("http://localhost:4500/user_log/view",
                { token, logId}
            )
            setSelectedLog(res.data)
            setMessage("")
        } catch (e) {
            console.error("Error fetching log:", err)
            setMessage("Failed to fetch log details.")
        }
    }
    
    return (
        <div style={{ padding: '20px' }}>
            <h2>Usage Logs</h2>
            <p>Here you can track your electricity usage history.</p>

            {message && <p style={{ color: "red" }}>{message}</p>}
            
            <ul>
                {logs.length > 0 ? (
                    logs.map((log) => (
                        <li key={log._id}>
                            <span>
                                Date: {newDate(log.createdAt).toLocalestring()} | Usage"{" "}
                                {log.energyUsage} kWh | Status: {log.status}
                            </span>
                            <button onClick={() => viewLog(log._id)}>
                                View Details
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No logs found.</p>
                )}
            </ul>
            
            {/* Single log details */}
            {selectedLog && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc "}}>
                    <h3>Log Detais</h3>
                    <p>ID: {selectedLog._id}</p>
                    <p>Meter ID: {selectedLog.meterId}</p>
                    <p>Energy Usage: {selectedLog.energyUsage} kWh</p>
                    <p>Status: {selectedLog.status}</p>
                    <p>Date: {newDate(selectedLog.createdAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    )
}

export default Log