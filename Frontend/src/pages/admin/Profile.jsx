import React, { useEffect, useState } from "react"
import axios from "axios"

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null)
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

        const res = await axios.post("http://localhost:4500/admin_profile", { token })
        setAdmin(res.data.admin);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.msg || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading your profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-gray-200 flex-col items-center justify-center p-10 rounded-r-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">PowerPay</h1>
        <p className="text-gray-400 text-center max-w-md leading-relaxed">
          Manage your personal information, update your details, and view your account profile here.
        </p>
      </div>

      {/* Right side content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">My Profile</h2>
          <p className="text-gray-500 text-center mb-6">
            View your account information and details
          </p>

          <div className="space-y-5 text-gray-700">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-lg font-semibold">{admin?.fullname}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-lg font-semibold">{admin?.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="text-lg font-semibold">{admin?.phone_no || "Not provided"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="text-lg font-semibold">{admin?.gender || "Not specified"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-lg font-semibold capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile


    /*
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken")
                if (!token) {
                    setError("You are not logged in.")
                    setLoading(false)
                    return
                }
                
                const res = await axios.post("http://localhost:4500/admin_profile", {
                   token: localStorage.getItem("token")
                })
                
                setAdmin(res.data.admin)
            } catch (err) {
                console.error("Error fetching profile:", err)
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
                    Admin Profile
                </h1>
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-400 text-sm">Full Name</p>
                        <p className="text-lg font-medium">{admin?.fullname}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-lg font-medium">{admin?.email}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Phone Number</p>
                        <p className="text-lg font-medium">{admin?.phone_no || "Not provided"}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Gender</p>
                        <p className="text-lg font-medium">{admin?.gender || "Not specified"}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400 text-sm">Role</p>
                        <p className="text-lg font-medium capitalize">{admin?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AdminProfile
*/