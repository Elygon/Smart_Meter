import React from 'react'
import { Link } from 'react-router-dom'

const UserDashboard = () => {
    // Dummy data for summary + recent readings
    const readings = [
        { date: "2025-08-01", units: 120, cost: 3000 },
        { date: "2025-08-05", units: 90, cost: 2250 },
        { date: "2025-08-10", units: 150, cost: 3750 }
    ]

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Welcome to Your Dashboard</h2>
            <p>Here's a quick overview of your smart meter account.</p>
            
            {/* ===== Dashboard Summary Cards ===== */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3 shadow">
                        <div className="card-body">
                            <h5 className="card-title">Total Units Consumed</h5>
                            <p className="card-text display-6">360 kWh</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3 shadow">
                        <div className="card-body">
                            <h5 className="card-title">Current Bill</h5>
                            <p className="card-text display-6">N9,000</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3 shadow">
                        <div className="card-body">
                            <h5 className="card-title">Last Payment</h5>
                            <p className="card-text display-6">N3,750</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Recent Readings Table ===== */}
            <div className="card shadow mb-4">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Recent Meter Readings</h5>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-stripped table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Units (kWh)</th>
                            <th>Cost (N)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readings.map((r, i) => (
                            <tr key={i}>
                                <td>{r.date}</td>
                                <td>{r.units}</td>
                                <td>{r.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== Navigation Cards ===== */}
            <h4>Quick Actions</h4>
            <div style={styles.cards}>
                <Link to="/user/apply"style={styles.cards}>
                    <h2>Apply for Meter</h2>
                    <p>Request a new prepaid or postpaid smart meter for your property.</p>
                </Link>

                <Link to="/user/view-meters"style={styles.cards}>
                    <h2>View All Meters</h2>
                    <p>See a list of all meters linked to your account.</p>
                </Link>

                <Link to="/user/recharge"style={styles.cards}>
                    <h2>Recharge Meter</h2>
                    <p>Buy tokens or recharge your IoT meter balance.</p>
                </Link>

                <Link to="/user/recharge-history"style={styles.cards}>
                    <h2>Recharge History</h2>
                    <p>View all your recharge history and its details.</p>
                </Link>

                <Link to="/user/logs"style={styles.cards}>
                    <h2>Usage Logs</h2>
                    <p>Check how much energy you have consumed.</p>
                </Link>

                <Link to="/user/notification"style={styles.cards}>
                    <h2>Notifications</h2>
                    <p>Stay updated with meter alerts and updates.</p>
                </Link>

                <Link to="/user/contact"style={styles.cards}>
                    <h2>Contact Support</h2>
                    <p>Send inquiries or complaints.</p>
                </Link>

                <Link to="/user/my-tickets"style={styles.cards}>
                    <h2>My Tickets</h2>
                    <p>Track your submitted support tickets.</p>
                </Link>

                <Link to="/user/change-password"style={styles.cards}>
                    <h2>Change Password</h2>
                    <p>Update your login credentials.</p>
                </Link>
            </div>
        </div>
    )
}

// Simple inline styles
const styles = {
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