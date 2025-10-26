import React, { useEffect, useState } from "react"
import axios from "axios"

const Logs = () => {
    const [logs, setLogs] = useState([])
    const [selectedLog, setSelectedLog] = useState(null)
    const [message, setMessage] = useState("")
    
    // Fetch all logs on page load
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.post("http://localhost:4500/user_log/all", { token })
                setLogs(res.data.logs || [])
            } catch (e) {
                console.error("Error fetching logs:", e)
                setMessage("Failed to fetch logs. Try again.")
            }
        }
        fetchLogs()
    }, [])
    
    // Fetch a single log when clicked
    const viewLog = async (logId) => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post("http://localhost:4500/user_log/view", { token, id: logId })
            setSelectedLog(res.data.log || [])
            setMessage("")
        } catch (e) {
            console.error("Error fetching log:", e)
            setMessage("Failed to fetch log details.")
        }
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left side panel */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
                <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                    View your electricity usage history and detailed consumption logs.
                    Keep track of your meter readings and monitor your usage patterns over time.
                </p>
            </div>
            
            {/* Right side (usage logs) */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Usage Logs
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Track your past meter readings and energy consumption
                    </p>
                    
                    {message && (
                        <p className="text-center text-red-600 mb-4 font-medium">{message}</p>
                    )}
                    
                    {logs.length === 0 ? (
                        <p className="text-gray-500 text-center">No logs found.</p>
                    ) : (
                        <ul className="space-y-3">
                            {logs.map((log) => (
                                <li
                                  key={log._id}
                                  className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                                >
                                    <div className="text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">Date:</span>{" "}
                                            {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Usage:</span>{" "}
                                            {log.energyUsage} kWh
                                        </p>
                                        <p>
                                            <span className="font-semibold">Status:</span> {log.status}
                                        </p>
                                    </div>
                                    <button
                                      onClick={() => viewLog(log._id)}
                                      className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-lg transition"
                                    >
                                        View Details
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {/* Selected log details */}
                    {selectedLog && (
                        <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                                Log Details
                            </h3>
                            <div className="space-y-1 text-gray-700 text-sm">
                                <p>
                                    <span className="font-semibold">ID:</span> {selectedLog._id}
                                </p>
                                <p>
                                    <span className="font-semibold">Meter ID:</span>{" "}
                                    {selectedLog.meter}
                                </p>
                                <p>
                                    <span className="font-semibold">Description:</span>{" "}
                                    {selectedLog.description}
                                </p>
                                <p>
                                    <span className="font-semibold">Balance:</span>{" "}
                                    {selectedLog.balance}
                                </p>
                                <p>
                                    <span className="font-semibold">Energy Usage:</span>{" "}
                                    {selectedLog.energyUsage} kWh
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    {selectedLog.status}
                                </p>
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {new Date(selectedLog.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Logs
