import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
    return (
        <div style={styles.container}>
            <h1>Admin Dashboard {admin ? admin.fullname : ''} </h1>
            <p>Welcome, Admin! Choose an action below:</p>
            
            <div style={styles.cards}>
                <Link to="/admin/manage-users"style={styles.cards}>
                    <h2>Manage Users</h2>
                    <p>View all registered users and their details.</p>
                </Link>

                <Link to="/admin/manage-meters"style={styles.cards}>
                    <h2>Manage Meters</h2>
                    <p>View all meters, their status and assigned users.</p>
                </Link>

                <Link to="/admin/all-notifications"style={styles.cards}>
                    <h2>Manage Notifications</h2>
                    <p>View, delete or create new notifications for users.</p>
                </Link>

                <Link to="/admin/replies"style={styles.cards}>
                    <h2>Reply to Tickets</h2>
                    <p>Respond to user inquiries and complaints.</p>
                </Link>

                <Link to="/user/recharge"style={styles.cards}>
                    <h2>Recharge Meter</h2>
                    <p>Buy tokens or recharge your IoT meter balance.</p>
                </Link>

                <Link to="/user/recharge-history"style={styles.cards}>
                    <h2>Recharge History</h2>
                    <p>View all your recharge history and its details.</p>
                </Link>

                <Link to="/admin/logs"style={styles.cards}>
                    <h2>View Logs</h2>
                    <p>Monitor activities, transactions and system events.</p>
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

export default AdminDashboard