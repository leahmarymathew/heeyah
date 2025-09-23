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
- **Room Allocation:** Assign students to specific rooms.
- **Complaint Management:** View and update the status of student-submitted requests.
- **Leave Approval:** Approve or reject leave applications.

### 👷 Caretaker
- **Attendance Marking:** Manually mark student attendance.
- **RFID Integration:** (Simulated) Automated attendance via RFID scans.

### 🧑‍🎓 Student
- **Dashboard:** Personalized view of room details, attendance, and request status.
- **Request System:** Raise maintenance complaints or other requests.
- **Leave System:** View leave history.
- **View Attendance:** Check personal attendance records.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable tech stack.

- **Frontend:**
  - **React.js:** A popular library for building user interfaces.
  - **Vite:** A next-generation frontend tooling for fast development.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

- **Backend:**
  - **Node.js:** A JavaScript runtime for building server-side applications.
  - **Express.js:** A minimal and flexible Node.js web application framework.
  - **ES Modules:** Using modern JavaScript modules for cleaner code.

- **Database & Authentication:**
  - **Supabase:** An open-source Firebase alternative.
  - **PostgreSQL:** The underlying robust and scalable SQL database.
  - **Supabase Auth:** For secure user authentication and management.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- **Node.js:** [Download & Install Node.js](https://nodejs.org/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/heeyah.git](https://github.com/your-username/heeyah.git)
    cd heeyah
    ```

2.  **Set up the Backend:**
    - Navigate to the server directory.
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
    - Open a new terminal and navigate to the client directory.
      ```sh
      cd client
      ```
    - Install NPM packages.
      ```sh
      npm install
      ```
    - Create a `.env.local` file in the `client` directory and add your public Supabase keys:
      ```env
      VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
      VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
      ```
    - Start the development server.
      ```sh
      npm run dev
      ```
    - Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

---

## 📂 Project Structure


heeyah/
├── client/              # React Frontend
│   ├── src/
│   └── ...
├── server/              # Express Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── app.js
│   └── index.js
└── README.md

