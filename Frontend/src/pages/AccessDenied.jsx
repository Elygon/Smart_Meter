import React from "react"
import { useNavigate } from "react-router-dom"
import jwtDecode from "jwt-decode"

const AccessDenied = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    let role = null
    if (token) {
        try {
            const decoded = jwtDecode(token)
            role = decoded.role // role is either "user" or "admin"
        } catch (e) {
            role = null // invalid token - treat as not logged in
        }
    }

    const handleGoBack = () => {
        if (role === "admin") {
            navigate("/admin/dashboard") // Admin - Admin Dashboard
        } else if (role === "user") {
            navigate("/user/dashboard") // User - User Dashboard
        } else {
            navigate("/") // Not logged in - Home
        }
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2> Access Denied </h2>
            <p>You don't have permission to view this page.</p>
            <button
            onClick={handleGoBack}
            style={{
                marginTop: "20px",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "5px",
                border: "none",
                background: "#007bff",
                color: "#fff"
             }}
            >
                Go Back Home
            </button>
        </div>
    )
}

export default AccessDenied