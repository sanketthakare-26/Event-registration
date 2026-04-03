const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

// Authentication Middleware
const requireAuth = (role) => (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    if (role && req.session.role !== role) {
        if (req.session.role === 'admin') return res.redirect('/admin');
        return res.redirect('/user');
    }
    next();
};

/* --- AUTHENTICATION ROUTES --- */

router.get("/", (req, res) => {
    res.redirect("/login");
});

router.get("/login", (req, res) => {
    const errorMsg = req.query.error ? `<div style="background:rgba(239, 68, 68, 0.1); color:var(--danger); padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-weight:500;">${req.query.error}</div>` : '';
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Login | Nirvana Events</title><link rel="stylesheet" href="/style.css"></head>
    <body>
        <div class="container" style="max-width: 400px;">
            <h2>Log In</h2>
            ${errorMsg}
            <form action="/login" method="POST">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Continue</button>
            </form>
            <p style="text-align:center; margin-top:20px; color:var(--text-muted); font-size:0.9rem;">
                Don't have an account? <a href="/register" style="color:var(--primary); text-decoration:none;">Register here</a>
            </p>
        </div>
    </body>
    </html>
    `);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
        return res.redirect('/login?error=Invalid username or password');
    }
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.username = user.username;
    
    if (user.role === 'admin') {
        res.redirect('/admin');
    } else {
        res.redirect('/user');
    }
});

router.get("/register", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Register | Nirvana Events</title><link rel="stylesheet" href="/style.css"></head>
    <body>
        <div class="container" style="max-width: 400px;">
            <h2>Register</h2>
            <form action="/register" method="POST">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Select Your Role</label>
                    <select name="role" required style="background:var(--surface); color:var(--text-main); padding:14px 16px; border:1px solid var(--border); border-radius:8px; font-family:inherit; font-size: 1rem; margin-top: 4px; outline:none;">
                        <option value="user">User / Student</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Create Account</button>
            </form>
            <p style="text-align:center; margin-top:20px; color:var(--text-muted); font-size:0.9rem;">
                Already have an account? <a href="/login" style="color:var(--primary); text-decoration:none;">Login here</a>
            </p>
        </div>
    </body>
    </html>
    `);
});

router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
        return res.redirect('/login?error=Username already exists, please login instead');
    }
    await User.create({ username, password, role });
    res.redirect('/login?error=Registration successful! Please login.');
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

/* --- USER DASHBOARD --- */
router.get("/user", requireAuth('user'), (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nirvana Tech Symposium 2026</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
                <h4 style="margin:0; color:var(--text-muted); font-weight: 500;">Welcome, ${req.session.username}</h4>
                <a href="/logout" class="btn btn-ghost" style="margin:0; width:auto; padding:8px 12px; font-size:0.8rem;">Logout</a>
            </div>
            <h1>Nirvana Tech Symposium '26</h1>
            
            <div class="event-details">
                <p>Welcome to the biggest tech event of the year! Join industry leaders, students, and professionals for a day of innovation, networking, and learning.</p>
                <br>
                <ul style="list-style-type: none; padding: 0; line-height: 2;">
                    <li>📅 <strong>Date:</strong> October 15, 2026</li>
                    <li>📍 <strong>Location:</strong> Main Convention Hall</li>
                    <li>🎯 <strong>Eligibility:</strong> Open to all tech enthusiasts</li>
                </ul>
            </div>
            
            <div class="action-bar" style="margin-bottom: 0;">
                <a href="/add.html" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 1.1rem;">Enroll Now</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Process Enrollment
router.post("/add", requireAuth('user'), async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.send("All fields required!");
    }

    await Event.create({ name, email, status: 'pending' });
    
    // Show success message
    res.send(`
        <!DOCTYPE html>
        <html><head><link rel="stylesheet" href="/style.css"></head>
        <body style="font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); height: 100vh; display: flex; justify-content: center; align-items: center;">
            <div class="container" style="text-align: center;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Registration Successful! 🎉</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Your application has been received and is currently <strong>pending admin approval</strong>.</p>
                <a href="/user" class="btn btn-primary">Return to Event Page</a>
            </div>
        </body></html>
    `);
});

/* --- ADMIN DASHBOARD --- */
router.get("/admin", requireAuth('admin'), async (req, res) => {
    const events = await Event.find();
    
    // Calculate stats
    const totalCount = events.length;
    const pendingCount = events.filter(e => e.status === 'pending' || !e.status).length;
    const approvedCount = events.filter(e => e.status === 'approved').length;
    const rejectedCount = events.filter(e => e.status === 'rejected').length;

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container container-admin">
            <div class="admin-header">
                <div>
                    <h1 style="margin: 0; text-align: left;">Dashboard Overview</h1>
                    <span style="color:var(--text-muted); font-size: 0.9rem;">Logged in as Admin: <strong>${req.session.username}</strong></span>
                </div>
                <a href="/logout" class="btn btn-ghost" style="width: auto; margin: 0; padding: 10px 16px;">Logout</a>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${totalCount}</h3>
                    <p>Total Applied</p>
                </div>
                <div class="stat-card">
                    <h3 style="color: #f59e0b;">${pendingCount}</h3>
                    <p>Pending</p>
                </div>
                <div class="stat-card">
                    <h3 style="color: #10b981;">${approvedCount}</h3>
                    <p>Approved</p>
                </div>
                <div class="stat-card">
                    <h3 style="color: #ef4444;">${rejectedCount}</h3>
                    <p>Rejected</p>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Current Status</th>
                            <th>Decision</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    if (events.length === 0) {
        html += `<tr><td colspan="4"><div class="empty-state empty-table">No applications yet.</div></td></tr>`;
    } else {
        events.forEach(e => {
            const status = e.status || 'pending';
            html += `
                        <tr>
                            <td><strong>${e.name}</strong></td>
                            <td>${e.email}</td>
                            <td><span class="badge badge-${status}">${status}</span></td>
                            <td>
                                <div class="table-actions">
                                    ${status === 'pending' ? `
                                        <a href="/admin/approve/${e._id}" class="btn" style="background:#10b981; color:white; padding:6px 10px; font-size:0.8rem; border-radius: 6px;">Approve</a>
                                        <a href="/admin/reject/${e._id}" class="btn" style="background:#ef4444; color:white; padding:6px 10px; font-size:0.8rem; border-radius: 6px;">Reject</a>
                                    ` : `
                                        <em style="color: var(--text-muted); font-size: 0.9rem;">Reviewed</em>
                                    `}
                                </div>
                            </td>
                        </tr>
            `;
        });
    }

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

router.get("/admin/approve/:id", requireAuth('admin'), async (req, res) => {
    await Event.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.redirect("/admin");
});

router.get("/admin/reject/:id", requireAuth('admin'), async (req, res) => {
    await Event.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect("/admin");
});

module.exports = router;