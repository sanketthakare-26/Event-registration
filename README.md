# Mini Project Of Node Js

# Nirvana Events Registration System 🎟️

A fully-featured Node.js and MongoDB web application that handles event registrations with comprehensive Role-Based Access Control! Features completely distinct dashboards for Users and Administrators.

## 🌟 Key Features

*   **Role-Based Authentication**: Secure login system dividing users into `admin` and `user` roles using `express-session`.
*   **User Portal**: A sleek landing page allowing authenticated students/users to enroll in upcoming tech symposiums.
*   **Admin Dashboard**: A glassmorphism analytical dashboard tracking live application metrics (Total, Pending, Approved, Rejected).
*   **Approval Workflow**: Admins can approve or reject pending applicant submissions with one-click actions.
*   **Premium Custom UI**: The frontend was built with vanilla HTML/CSS boasting modern UI trends, `Inter` fonts, and glass-like card styling.

## 🛠️ Tech Stack 

*   **Backend:** Node.js & Express
*   **Database:** MongoDB (using Mongoose ODM)
*   **Authentication:** `express-session`
*   **Frontend:** Vanilla JS / HTML / CSS

## 🚀 How to Run the Project Local Server

1. Open your terminal or command prompt.
2. Ensure you have Node.js and MongoDB installed locally.
3. Change into the specific project directory:
   ```bash
   cd event-registration
   ```
4. Install the required Node packages (if not already installed):
   ```bash
   npm install express mongoose body-parser dotenv express-session
   ```
5. Start the backend server:
   ```bash
   node server.js
   ```
6. Open your web browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

## 🗄️ How to View Your Database

Your data is stored locally in MongoDB. Your server connects to: `mongodb://127.0.0.1:27017/eventDB`.

To visually inspect your database, users, and registrations:

### Option 1: MongoDB Compass (Recommended)
1. Download and install **[MongoDB Compass](https://www.mongodb.com/products/tools/compass)** (a free visual database explorer from MongoDB).
2. Open MongoDB Compass.
3. In the "New Connection" URL bar, paste your connection string: 
   `mongodb://127.0.0.1:27017`
4. Click **Connect**.
5. Look on the left-hand sidebar for a database named **`eventDB`**.
6. Inside `eventDB`, you will see two collections (tables):
   *   **`users`**: Contains all the login credentials and roles you registered.
   *   **`events`**: Contains the actual event enrollment applications and their "pending/approved" statuses!

### Option 2: Mongo Shell (mongosh)
If you prefer the command line:
1. Open your terminal and type `mongosh`.
2. Type `use eventDB` to switch to your project database.
3. Type `db.users.find().pretty()` to view registered accounts.
4. Type `db.events.find().pretty()` to view all applicant enrollments.
