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

import React, { useEffect, useState } from "react";
import back from "../../assets/Arrow 1.png";
import "./WardenComplaint.css";
import {supabase} from "../../supabase.js"; // if using Supabase for auth

function WardenComplaint() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      // Get Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return console.error("No token found");

      try {
        const res = await fetch("http://localhost:3001/api/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching complaints:", res.status);
          return;
        }

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="main">
      <button className="image-button" onClick={() => window.history.back()}>
        <img src={back} alt="Back" width="30px" />
      </button>

      <div className="warden-complaint-container">
        <p className="head">Hostel Complaints</p>
        <table>
          <thead>
            <tr>
              <th className="Student heading">Student</th>
              <th className="room heading">Room</th>
              <th className="details heading">Complaint Details</th>
              <th className="status heading">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.request_id}>
                <td className="Student">
                  <strong>{c.student.name}</strong>
                  <br />
                  {c.student.roll_no}
                </td>
                <td className="room">{c.student.room_no}</td>
                <td className="details">
                  <strong>{c.request_type}:</strong> {c.description}
                </td>
                <td className="status">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WardenComplaint;
