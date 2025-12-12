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

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import "./WardenComplaint.css";

function WardenComplaint() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('request')
        .select(`
          *,
          student ( name, roll_no )
        `)
        .order('request_date', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to fetch requests');
      } else {
        console.log('Request records data:', data);
        setRequests(data || []);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/warden-dashboard');
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const { error } = await supabase
        .from('request')
        .update({ status: newStatus })
        .eq('request_id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.request_id === requestId ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="complaint-page">
        <div className="complaint-header">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h1 className="page-title">Student Requests</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaint-page">
        <div className="complaint-header">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h1 className="page-title">Student Requests</h1>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchRequests}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-page">
      <div className="complaint-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <h1 className="page-title">Student Requests</h1>
      </div>

      <div className="complaint-content">
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Requests Found</h3>
            <p>There are currently no student requests to display.</p>
          </div>
        ) : (
          <div className="complaint-table-container">
            <div className="table-wrapper">
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th style={{width: '20%', minWidth: '180px'}}>Student</th>
                    <th style={{width: '15%', minWidth: '120px'}}>Request Date</th>
                    <th style={{width: '40%', minWidth: '300px'}}>Request Details</th>
                    <th style={{width: '15%', minWidth: '120px'}}>Status</th>
                    <th style={{width: '10%', minWidth: '100px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.request_id || index}>
                      <td style={{width: '20%', minWidth: '180px', padding: '16px', verticalAlign: 'top', borderRight: '1px solid #f0f0f0'}}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#333'}}>
                            {request.student?.name || 'Unknown Student'}
                          </div>
                          <div style={{fontSize: '14px', color: '#666', fontFamily: 'monospace'}}>
                            {request.student?.roll_no || request.roll_no}
                          </div>
                        </div>
                      </td>
                      <td style={{width: '15%', minWidth: '120px', padding: '16px', textAlign: 'center', verticalAlign: 'top', borderRight: '1px solid #f0f0f0'}}>
                        <div style={{fontSize: '14px', color: '#333'}}>
                          {formatDate(request.request_date)}
                        </div>
                      </td>
                      <td style={{width: '40%', minWidth: '300px', padding: '16px', verticalAlign: 'top', borderRight: '1px solid #f0f0f0'}}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{fontWeight: 'bold', color: '#333', fontSize: '14px'}}>
                            {request.request_type || 'General Request'}:
                          </div>
                          <div style={{color: '#666', fontSize: '14px', lineHeight: '1.4'}}>
                            {request.description || 'No description provided'}
                          </div>
                        </div>
                      </td>
                      <td style={{width: '15%', minWidth: '120px', padding: '16px', textAlign: 'center', verticalAlign: 'top', borderRight: '1px solid #f0f0f0'}}>
                        <span className={`status-badge status-${request.status}`}>
                          {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td style={{width: '10%', minWidth: '100px', padding: '16px', verticalAlign: 'top'}}>
                        {request.status === 'pending' ? (
                          <div className="action-buttons">
                            <button 
                              className="resolve-btn"
                              onClick={() => handleUpdateStatus(request.request_id, 'approved')}
                            >
                              Approve
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => handleUpdateStatus(request.request_id, 'rejected')}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="final-status">
                            {request.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WardenComplaint;
