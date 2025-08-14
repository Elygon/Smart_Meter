import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const UserDashboard = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Simulate fetching logged-in user's profile from localStorage or API
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    return (
        <div style={styles.container}>
            <h1>Welcome to Your Dashboard {user ? user.fullname : ''} </h1>
            <p>Here's a quick overview of your smart meter account.</p>
            
            <div style={styles.cards}>
                <Link to="/user/apply"style={styles.cards}>
                    <h2>Apply for Meter</h2>
                    <p>Request a new prepaid or postpaid smart meter for your property.</p>
                </Link>

                <Link to="/user/view-meters"style={styles.cards}>
                    <h2>View All Meters</h2>
                    <p>See a list of all meters linked to your account.</p>
                </Link>

                <Link to="/user/view-meter"style={styles.cards}>
                    <h2>View Specific Meter</h2>
                    <p>Check details, balance and usage for a selected meter.</p>
                </Link>

                <Link to="/user/recharge"style={styles.cards}>
                    <h2>Recharge Meter</h2>
                    <p>Buy tokens or recharge your IoT meter balance.</p>
                </Link>

                <Link to="/user/logs"style={styles.cards}>
                    <h2>Usage Logs</h2>
                    <p>Check how much energy you have consumed.</p>
                </Link>

                <Link to="/user/notification"style={styles.cards}>
                    <h2>Notifications</h2>
                    <p>Stay updated with meter alerts and updates.</p>
                </Link>

                <Link to="/user/change-password"style={styles.cards}>
                    <h2>Change Password</h2>
                    <p>Update your password below. You will need to log in again after changing it.</p>
                </Link>
            </div>
        </div>
    )
}

// Simple inline styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sansSerif'
    },
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
     },
    card: {
        background: '#f4f4f4',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'black'
    }
}

export default UserDashboard