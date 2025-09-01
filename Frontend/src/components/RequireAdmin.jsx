import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const RequireAdmin = ({ children }) => {
    const token = localStorage.getItem("token")

    if (!token) {
        // If no token, redirect to login page
        return <Navigate to ="/admin/login" replace />
    }

    try {
        const decoded = jwtDecode(token)

        if (decoded.role !== "admin") {
            // Logged in but not admin - show access denied
            return <Navigate to="/access-denied" replace />
        }

        // Admin access granted
        return children
    } catch (e) {
        // Invalid token - force re-login
        return <Navigate to="/admin/login" replace />
    }
}

export default RequireAdmin