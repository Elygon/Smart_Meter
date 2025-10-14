import React, { useEffect, useState } from "react"

const Profile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("You are not logged in.")
                    setLoading(false)
                    return
                }
                
                const res = await axios.post("http://localhost:4500/user_profile/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                
                const data = await res.json()
                
                if (res.ok) {
                    setUser(data.user)
                } else {
                    setError(data.message || "Failed to load profile.")
                }
            } catch (err) {
                setError("Unable to connect to the server.")
            } finally {
                setLoading(false)
            }
        }
        
        fetchProfile()
    }, [])
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                Loading your profile...
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
                {error}
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md mt-10">
                <h1 className="text-2xl font-semibold mb-4 text-center border-b border-gray-700 pb-2">
                    My Profile
                </h1>
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-400 text-sm">Full Name</p>
                        <p className="text-lg font-medium">{user?.fullname}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-lg font-medium">{user?.email}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Phone Number</p>
                        <p className="text-lg font-medium">{user?.phone_no || "Not provided"}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Gender</p>
                        <p className="text-lg font-medium">{user?.gender || "Not specified"}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Role</p>
                        <p className="text-lg font-medium capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
