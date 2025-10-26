// import React from "react";
// import back from "../../assets/Arrow 1.png";
// import "./WardenComplaint.css";

// function WardenComplaint() {
//   const mockdata = [
//     { "id": 1, "name": "Abhishek R", "rollno": "2023BCY0049", "room": "301", "complaintType": "Electrical", "complaintDetails": "Fan is not working. It was making a loud noise and then stopped.", "status": "Pending" },
//     { "id": 2, "name": "Priya Sharma", "rollno": "2022BME0012", "room": "105", "complaintType": "Plumbing", "complaintDetails": "The shower tap is broken and leaking continuously.", "status": "In Progress" },
//     { "id": 3, "name": "Karan Singh", "rollno": "2024BEE0088", "room": "212", "complaintType": "Carpentry", "complaintDetails": "My study table chair is broken. One of the legs is loose.", "status": "Resolved" },
//     { "id": 4, "name": "Anjali Mehta", "rollno": "2023BCS0150", "room": "404", "complaintType": "Internet/Wi-Fi", "complaintDetails": "The Wi-Fi signal is very weak in my room. The LAN port is also not working.", "status": "In Progress" },
//     { "id": 5, "name": "Rohan Verma", "rollno": "2022BCE0031", "room": "G07", "complaintType": "Housekeeping", "complaintDetails": "Room hasn't been cleaned for two days. The dustbin is full.", "status": "Pending" },
//     { "id": 6, "name": "Aisha Begum", "rollno": "2025BAR0005", "room": "110", "complaintType": "Electrical", "complaintDetails": "The main tube light is flickering constantly.", "status": "Resolved" },
//     { "id": 7, "name": "Vikram Rathore", "rollno": "2023BBA0067", "room": "320", "complaintType": "Plumbing", "complaintDetails": "Toilet flush is not working properly. Water keeps running.", "status": "Pending" },
//     { "id": 8, "name": "Sneha Patil", "rollno": "2022BME0025", "room": "205", "complaintType": "Carpentry", "complaintDetails": "The closet door hinge is loose, and the door won't close.", "status": "In Progress" },
//     { "id": 9, "name": "Arjun Nair", "rollno": "2023BCY0055", "room": "309", "complaintType": "Pest Control", "complaintDetails": "Seeing a lot of ants near the window and in the cupboard.", "status": "Resolved" },
//     { "id": 10, "name": "Meera Iyer", "rollno": "2024BEE0100", "room": "401", "complaintType": "Internet/Wi-Fi", "complaintDetails": "No internet connection on the LAN port.", "status": "Pending" },
//     { "id": 11, "name": "David Lee", "rollno": "2023BCS0112", "room": "302", "complaintType": "Electrical", "complaintDetails": "The power socket near my bed is not working.", "status": "Resolved" },
//     { "id": 12, "name": "Fatima Khan", "rollno": "2022BCE0040", "room": "115", "complaintType": "Housekeeping", "complaintDetails": "Bathroom has not been cleaned this week.", "status": "In Progress" },
//     { "id": 13, "name": "Rahul Desai", "rollno": "2023BBA0071", "room": "215", "complaintType": "Plumbing", "complaintDetails": "The sink in the bathroom is clogged.", "status": "Pending" },
//     { "id": 14, "name": "Nidhi Gupta", "rollno": "2025BAR0011", "room": "101", "complaintType": "Carpentry", "complaintDetails": "The window latch is broken and it won't lock.", "status": "In Progress" },
//     { "id": 15, "name": "Zara Husain", "rollno": "2022BME0033", "room": "220", "complaintType": "Electrical", "complaintDetails": "Water heater is not working in the bathroom.", "status": "Resolved" },
//     { "id": 16, "name": "Suresh Kumar", "rollno": "2023BCY0099", "room": "G12", "complaintType": "Other", "complaintDetails": "There is a beehive forming outside my window.", "status": "Pending" },
//     { "id": 17, "name": "Pooja Singh", "rollno": "2024BEE0077", "room": "411", "complaintType": "Housekeeping", "complaintDetails": "Corridor outside my room is very dirty and has a bad smell.", "status": "Resolved" }
//   ];
//   return (
//     <>
//       <div className="main">
//         <button className="image-button" onClick={() => window.history.back()}>
//           <img src={back} alt="Back" width="30px"></img>
//         </button>
//         <div className="warden-complaint-container">
//           <p className='head'>Hostel Complaints</p>
//           <table>
//             <thead>
//                 <tr>
//                     <th className='Student heading'>Student</th>
//                     <th className='room heading'>Room</th>
//                     <th className='details heading'>Complaint Details</th>
//                     <th className='status heading'>Status</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {mockdata.map((complaint) => (
//                 <tr key={complaint.id}>
//                     <td className='Student'><strong>{complaint.name}</strong><br/>{complaint.rollno}</td>
//                     <td className='room'>{complaint.room}</td>
//                     <td className='details'><strong>{complaint.complaintType}:</strong> {complaint.complaintDetails}</td>
//                     <td className='status'>{complaint.status}</td>
//                 </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// export default WardenComplaint;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import WardenLayout from '../../components/WardenLayout';
import back from "../../assets/Arrow 1.png";
import "./WardenComplaint.css";

function WardenComplaint() {
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      name: "Abhishek R",
      rollNo: "2023BCY0049",
      room: "301",
      complaintType: "Electrical",
      complaintDetails: "Fan is not working. It was making a loud noise and then stopped.",
      status: "pending"
    },
    {
      id: 2,
      name: "Priya Sharma",
      rollNo: "2022BME0012",
      room: "105",
      complaintType: "Plumbing",
      complaintDetails: "The shower tap is broken and leaking continuously.",
      status: "in-progress"
    },
    {
      id: 3,
      name: "Karan Singh",
      rollNo: "2024BEE0088",
      room: "212",
      complaintType: "Carpentry",
      complaintDetails: "My study table chair is broken. One of the legs is loose.",
      status: "resolved"
    },
    {
      id: 4,
      name: "Anjali Mehta",
      rollNo: "2023BCS0150",
      room: "404",
      complaintType: "Internet/Wi-Fi",
      complaintDetails: "The Wi-Fi signal is very weak in my room. The LAN port is also not working.",
      status: "in-progress"
    },
    {
      id: 5,
      name: "Rohan Verma",
      rollNo: "2022BCE0031",
      room: "G07",
      complaintType: "Housekeeping",
      complaintDetails: "Room hasn't been cleaned for two days. The dustbin is full.",
      status: "pending"
    },
    {
      id: 6,
      name: "Aisha Begum",
      rollNo: "2025BAR0005",
      room: "110",
      complaintType: "Electrical",
      complaintDetails: "The main tube light is flickering constantly.",
      status: "resolved"
    }
  ]);

  const handleBack = () => {
    navigate('/warden-dashboard');
  };

  const handleUpdateStatus = (id, newStatus) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );
  };

  return (
    <WardenLayout>
      <div className="warden-complaint-main">
        <div className="warden-complaint-header">
          <button type="button" className="back-button" onClick={handleBack}>
            <img src={back} alt="Back" width="24px" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="page-title">Hostel Complaints</h1>
        </div>

        <div className="warden-complaint-container">
          <div className="table-container">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Complaint Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="student-cell">
                      <div className="student-info">
                        <strong>{complaint.name}</strong>
                        <span className="roll-no">{complaint.rollNo}</span>
                      </div>
                    </td>
                    <td className="room-cell">
                      <span className="room-number">{complaint.room}</span>
                    </td>
                    <td className="details-cell">
                      <div className="complaint-details">
                        <strong className="complaint-type">{complaint.complaintType}:</strong>
                        <p className="complaint-description">{complaint.complaintDetails}</p>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${complaint.status}`}>
                        {complaint.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {complaint.status === 'pending' ? (
                        <div className="action-buttons">
                          <button 
                            className="assign-btn"
                            onClick={() => handleUpdateStatus(complaint.id, 'in-progress')}
                          >
                            Assign
                          </button>
                          <button 
                            className="resolve-btn"
                            onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                          >
                            Resolve
                          </button>
                        </div>
                      ) : complaint.status === 'in-progress' ? (
                        <button 
                          className="resolve-btn"
                          onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="final-status">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WardenLayout>
  );
}

export default WardenComplaint;
