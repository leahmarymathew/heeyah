# Heeyah - Hostel Management System 🏨

![Hostel Management](https://placehold.co/800x300/6366f1/ffffff?text=Heeyah+Hostel+System)

A comprehensive, modern hostel management system designed to streamline operations for administrators, wardens, caretakers, and students. This project provides a full-stack solution with a secure backend API and a responsive React frontend.

---

## ✨ Features

The system is designed with role-based access control, providing tailored functionality for each user type.

### 👨‍💼 Admin
- **Dashboard:** High-level overview of the entire system.
- **Warden Management:** Register and manage warden accounts.
- **Hostel Management:** Create and manage different hostel blocks.
- **System Reports:** Generate and view system-wide reports on attendance and complaints.

### 👮 Warden
- **Dashboard:** Operational view of pending requests, leave applications, and student activity.
- **Student Management:** Register new students and manage their profiles.
- **Room Allocation:** Assign students to specific rooms and manage room inventory.
- **Complaint Management:** View and update the status of student-submitted maintenance requests.
- **Leave Approval:** Approve or reject student leave applications.
- **Attendance Overview:** Monitor daily attendance records.

### 👷 Caretaker
- **Attendance Marking:** Manually mark student attendance.
- **RFID Integration:** (Simulated) Automated attendance via RFID scans.

### 🧑‍🎓 Student
- **Dashboard:** Personalized view of room details, attendance, and request status.
- **Complaint / Request System:** Raise maintenance complaints or other requests.
- **Leave System:** Submit and track leave applications.
- **View Attendance:** Check personal attendance records.
- **Lost & Found:** Report lost items and browse found items posted in the hostel.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable tech stack.

- **Frontend:**
  - **React.js** with **React Router v6** for client-side routing and navigation.
  - **Vite** for fast development builds and hot module replacement.
  - **Tailwind CSS** with `@tailwindcss/forms` for rapid, utility-first UI development.
  - **FontAwesome** and **React Icons** for iconography.
  - **React Calendar** for date selection UIs.
  - **Axios** for HTTP communication with the backend API.
  - **Supabase JS Client** for direct client-side auth and real-time features.

- **Backend:**
  - **Node.js** runtime with **ES Modules**.
  - **Express.js v5** as the web application framework.
  - **Helmet** for securing HTTP headers.
  - **CORS** configured for local development origins.
  - **Multer** for file/image upload handling.
  - **JSON Web Tokens (JWT)** for stateless API authentication.
  - **UUID** for generating unique identifiers.

- **Database & Authentication:**
  - **Supabase** (open-source Firebase alternative) — hosted **PostgreSQL** database.
  - **Supabase Auth** for secure user authentication and role management.
  - **Supabase Service Role Key** used server-side for privileged database operations.

- **Testing:**
  - **Jest** with `jest-environment-jsdom` for both frontend and backend unit tests.
  - **@testing-library/react** for component-level UI testing.
  - **Babel** (`@babel/preset-env`, `@babel/preset-react`) for transpiling test files.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- **Node.js:** [Download & Install Node.js](https://nodejs.org/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/leahmarymathew/heeyah.git
    cd heeyah
    ```

2.  **Set up the Backend:**
    - Navigate to the `server` directory.
      ```sh
      cd server
      ```
    - Install NPM packages.
      ```sh
      npm install
      ```
    - Create a `.env` file in the `server` directory and add your Supabase credentials:
      ```env
      SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
      SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
      PORT=3001
      ```
    - Start the server.
      ```sh
      npm start
      ```
    - Your backend API will be running at `http://localhost:3001`.

3.  **Set up the Frontend:**
    - Open a new terminal and navigate to the `frontend` directory.
      ```sh
      cd frontend
      ```
    - Install NPM packages.
      ```sh
      npm install
      ```
    - Create a `.env` file in the `frontend` directory and add your public Supabase keys:
      ```env
      VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
      VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
      VITE_API_URL=http://localhost:3001
      ```
    - Start the development server.
      ```sh
      npm run dev
      ```
    - Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

---

## 📂 Project Structure
```

heeyah/
├── frontend/                        # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Shared UI components (Navbar, Header, Layout, etc.)
│   │   ├── context/                 # React Context (AuthContext)
│   │   ├── pages/                   # Page-level components
│   │   │   ├── student/             #   Student-specific pages (Attendance, Leave, LostFound)
│   │   │   ├── warden/              #   Warden-specific pages (Attendance, Complaints, Leave)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── wardenDashboard.jsx
│   │   │   ├── Complaint.jsx
│   │   │   ├── LostAndFound.jsx
│   │   │   ├── roomAllocation.jsx
│   │   │   └── login.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── supabase.js              # Supabase client initialisation
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── config/
│   │   └── supabaseClient.js        # Supabase admin client
│   ├── controllers/                 # Business logic (auth, student, warden, room, etc.)
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification middleware
│   │   └── simpleAuth.js
│   ├── routes/                      # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── wardenRoutes.js
│   │   ├── caretakerRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── roomAllocRoutes.js
│   │   ├── hostelRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── lostAndFoundRoutes.js
│   │   └── reportsRoutes.js
│   ├── app.js                       # Express app setup & middleware
│   ├── index.js                     # Server entry point
│   ├── db.js                        # Database helpers
│   ├── .env
│   └── package.json
│
├── jest.config.js                   # Root Jest configuration
├── quick-test.js                    # Quick smoke-test script
└── README.md

```
---




