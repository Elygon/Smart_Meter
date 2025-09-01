import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const RequireUser = ({ children }) => {
    const token = localStorage.getItem("userToken") || localStorage.getItem("token")

    if (!token) {
        // If no token, redirect to user login page
        return <Navigate to ="/user/login" replace />
    }

    try {
        const decoded = jwtDecode(token)

        if (decoded.role !== "user") {
            // Logged in but not user - redirect to AccessDenied
            return <Navigate to="/access-denied" replace />
        }

        // User access granted
        return children
        
    } catch (e) {
        // Invalid token - force re-login
        return <Navigate to="/user/login" replace />
    }
}

export default RequireUser