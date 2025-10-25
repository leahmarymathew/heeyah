// import './WardenLeave.css';
// import Navbar from "../../components/Navbar";
// import back from "../../assets/Arrow 1.png";

// function WardenLeave() {
//   const initialLeaveRequests = [
//     {
//         id: 1,
//         student: {
//             name: 'Abhishek R',
//             rollNo: '2023BCY0049',
//             phone: '+91 98765 43210',
//             semester: '5th',
//             course: 'B.Tech Computer Science',
//             hostel: 'Block C, Room 201',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AR'
//         },
//         guardian: {
//             name: 'Ramesh Kumar',
//             contact: 'ramesh.k@example.com',
//         },
//         leave: {
//             startDate: '2025-02-01',
//             endDate: '2025-02-04',
//             startTime: '09:00 AM',
//             eta: '06:00 PM on 2025-02-04',
//             reason: 'Going home for a family function.',
//             totalDays: 4,
//             workingDays: 2,
//         },
//         status: 'pending',
//     },
//     {
//         id: 2,
//         student: {
//             name: 'Priya Sharma',
//             rollNo: '2022BME0012',
//             phone: '+91 91234 56789',
//             semester: '6th',
//             course: 'B.Tech Mechanical Eng.',
//             hostel: 'Block A, Room 105',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=PS'
//         },
//         guardian: {
//             name: 'Sunita Sharma',
//             contact: '+91 99887 76655',
//         },
//         leave: {
//             startDate: '2025-01-28',
//             endDate: '2025-01-29',
//             startTime: '05:00 PM',
//             eta: '09:00 PM on 2025-01-29',
//             reason: 'Attending a wedding.',
//             totalDays: 2,
//             workingDays: 1,
//         },
//         status: 'approved',
//     },
//     {
//         id: 3,
//         student: {
//             name: 'Karan Singh',
//             rollNo: '2024BEE0088',
//             phone: '+91 87654 32109',
//             semester: '3rd',
//             course: 'B.Tech Electrical Eng.',
//             hostel: 'Block B, Room 311',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=KS'
//         },
//         guardian: {
//             name: 'Vikram Singh',
//             contact: 'vikram.s@example.com',
//         },
//         leave: {
//             startDate: '2025-02-05',
//             endDate: '2025-02-05',
//             startTime: '10:00 AM',
//             eta: '08:00 PM on 2025-02-05',
//             reason: 'Medical appointment.',
//             totalDays: 1,
//             workingDays: 1,
//         },
//         status: 'pending',
//     },
//      {
//         id: 5,
//         student: {
//             name: 'Anjali Mehta',
//             rollNo: '2023BCS0150',
//             phone: '+91 76543 21098',
//             semester: '5th',
//             course: 'B.Sc Chemistry',
//             hostel: 'Block D, Room 402',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AM'
//         },
//         guardian: {
//             name: 'Deepak Mehta',
//             contact: '+91 88776 65544',
//         },
//         leave: {
//             startDate: '2025-01-25',
//             endDate: '2025-01-27',
//             startTime: '04:00 PM',
//             eta: '07:00 PM on 2025-01-27',
//             reason: 'Personal reasons.',
//             totalDays: 3,
//             workingDays: 2,
//         },
//         status: 'rejected',
//     },
//     {
//         id: 6,
//         student: {
//             name: 'Anjali Mehta',
//             rollNo: '2023BCS0150',
//             phone: '+91 76543 21098',
//             semester: '5th',
//             course: 'B.Sc Chemistry',
//             hostel: 'Block D, Room 402',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AM'
//         },
//         guardian: {
//             name: 'Deepak Mehta',
//             contact: '+91 88776 65544',
//         },
//         leave: {
//             startDate: '2025-01-25',
//             endDate: '2025-01-27',
//             startTime: '04:00 PM',
//             eta: '07:00 PM on 2025-01-27',
//             reason: 'Personal reasons.',
//             totalDays: 3,
//             workingDays: 2,
//         },
//         status: 'rejected',
//     },
//     {
//         id: 7,
//         student: {
//             name: 'Abhishek R',
//             rollNo: '2023BCY0049',
//             phone: '+91 98765 43210',
//             semester: '5th',
//             course: 'B.Tech Computer Science',
//             hostel: 'Block C, Room 201',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AR'
//         },
//         guardian: {
//             name: 'Ramesh Kumar',
//             contact: 'ramesh.k@example.com',
//         },
//         leave: {
//             startDate: '2025-02-01',
//             endDate: '2025-02-04',
//             startTime: '09:00 AM',
//             eta: '06:00 PM on 2025-02-04',
//             reason: 'Going home for a family function.',
//             totalDays: 4,
//             workingDays: 2,
//         },
//         status: 'pending',
//     },
//     {
//         id: 8,
//         student: {
//             name: 'Priya Sharma',
//             rollNo: '2022BME0012',
//             phone: '+91 91234 56789',
//             semester: '6th',
//             course: 'B.Tech Mechanical Eng.',
//             hostel: 'Block A, Room 105',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=PS'
//         },
//         guardian: {
//             name: 'Sunita Sharma',
//             contact: '+91 99887 76655',
//         },
//         leave: {
//             startDate: '2025-01-28',
//             endDate: '2025-01-29',
//             startTime: '05:00 PM',
//             eta: '09:00 PM on 2025-01-29',
//             reason: 'Attending a wedding.',
//             totalDays: 2,
//             workingDays: 1,
//         },
//         status: 'approved',
//     },
//     {
//         id: 9,
//         student: {
//             name: 'Karan Singh',
//             rollNo: '2024BEE0088',
//             phone: '+91 87654 32109',
//             semester: '3rd',
//             course: 'B.Tech Electrical Eng.',
//             hostel: 'Block B, Room 311',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=KS'
//         },
//         guardian: {
//             name: 'Vikram Singh',
//             contact: 'vikram.s@example.com',
//         },
//         leave: {
//             startDate: '2025-02-05',
//             endDate: '2025-02-05',
//             startTime: '10:00 AM',
//             eta: '08:00 PM on 2025-02-05',
//             reason: 'Medical appointment.',
//             totalDays: 1,
//             workingDays: 1,
//         },
//         status: 'pending',
//     },
//      {
//         id: 10,
//         student: {
//             name: 'Anjali Mehta',
//             rollNo: '2023BCS0150',
//             phone: '+91 76543 21098',
//             semester: '5th',
//             course: 'B.Sc Chemistry',
//             hostel: 'Block D, Room 402',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AM'
//         },
//         guardian: {
//             name: 'Deepak Mehta',
//             contact: '+91 88776 65544',
//         },
//         leave: {
//             startDate: '2025-01-25',
//             endDate: '2025-01-27',
//             startTime: '04:00 PM',
//             eta: '07:00 PM on 2025-01-27',
//             reason: 'Personal reasons.',
//             totalDays: 3,
//             workingDays: 2,
//         },
//         status: 'rejected',
//     },
//     {
//         id: 11,
//         student: {
//             name: 'Anjali Mehta',
//             rollNo: '2023BCS0150',
//             phone: '+91 76543 21098',
//             semester: '5th',
//             course: 'B.Sc Chemistry',
//             hostel: 'Block D, Room 402',
//             avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AM'
//         },
//         guardian: {
//             name: 'Deepak Mehta',
//             contact: '+91 88776 65544',
//         },
//         leave: {
//             startDate: '2025-01-25',
//             endDate: '2025-01-27',
//             startTime: '04:00 PM',
//             eta: '07:00 PM on 2025-01-27',
//             reason: 'Personal reasons.',
//             totalDays: 3,
//             workingDays: 2,
//         },
//         status: 'rejected',
//     },
// ];
//   return (
//     <>

//         <div className="main">
//         <button type="button" className="image-button">
//           <img
//             src={back}
//             alt="Back"
//             width="30px"
//           />
//         </button>
//         <div className="warden-leave-container">
//             <p className='head'>Leave Requests</p>
//             <table>
//               <thead>
//                 <tr>
//                   <th className='applicant heading'>Applicant</th>
//                   <th className='details1 heading'>Details</th>
//                   {/* <th className='actions heading'>Actions</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {initialLeaveRequests.map((request) => (
//                 <tr key={request.id}>
//                   <td className='applicant'><strong>{request.student.name}</strong></td>
//                   <td className='details1'>
//                     <strong>From:</strong> {request.leave.startDate} <br />
//                     <strong>To:</strong> {request.leave.endDate} <br />
//                     <strong>Reason:</strong> {request.leave.reason} <br />
//                   </td>
//                   {/* <td className='actions'>
//                     {request.status === 'pending' && (
//                       <button className='approve-button'>Approve</button>
//                     )}
//                     {request.status === 'pending' && (
//                       <button className='reject-button'>Reject</button>
//                     )}
//                     {request.status === 'approved' && (
//                       <span className='status-approved'>Approved</span>
//                     )}
//                     {request.status === 'rejected' && (
//                       <span className='status-rejected'>Rejected</span>
//                     )}
//                   </td> */}
//                 </tr>
//                 ))}
//               </tbody>
//             </table>
//         </div>
//         </div>
//     </>
//   );
// }

// export default WardenLeave;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../../supabase';
import back from "../../assets/Arrow 1.png";
import './WardenLeave.css';

const API_BASE_URL = 'http://localhost:3001';

function WardenLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("No valid session. Please log in.");
        setLoading(false);
        return;
      }

      const token = session.access_token;

      const res = await axios.get(`${API_BASE_URL}/api/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Approve or Reject leave
  const handleUpdateStatus = async (leaveId, action) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("No valid session. Please log in.");
        return;
      }
      const token = session.access_token;

      const res = await axios.patch(
        `${API_BASE_URL}/api/leave/${leaveId}/status`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI optimistically
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.leave_id === leaveId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected', approved_by: action === 'approve' ? 'warden' : null } : req
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || `Failed to ${action} leave`);
    }
  };

  return (
    <div className="main">
      <button type="button" className="image-button">
        <img src={back} alt="Back" width="30px" />
      </button>

      <div className="warden-leave-container">
        <p className='head'>Leave Requests</p>

        {loading && <p>Loading leave requests...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && leaveRequests.length === 0 && <p>No leave requests found.</p>}

        {!loading && !error && leaveRequests.length > 0 && (
          <table>
            <thead>
              <tr>
                <th className='applicant heading'>Applicant</th>
                <th className='details1 heading'>Details</th>
                <th className='status heading'>Status</th>
                <th className='actions heading'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => {
                const status = request.status || (!request.approved_by ? 'pending' : 'approved');
                return (
                  <tr key={request.leave_id}>
                    <td className='applicant'>
                      <strong>{request.STUDENT?.name || request.roll_no}</strong> <br />
                      Roll No: {request.STUDENT?.roll_no || request.roll_no}
                    </td>
                    <td className='details1'>
                      <strong>From:</strong> {new Date(request.leave_start_time).toLocaleDateString()} <br />
                      <strong>To:</strong> {new Date(request.leave_end_time).toLocaleDateString()} <br />
                      <strong>Reason:</strong> {request.reason}
                    </td>
                    <td className='status'>{status.charAt(0).toUpperCase() + status.slice(1)}</td>
                    <td className='actions'>
                      {status === 'pending' && (
                        <>
                          <button 
                            className='approve-button'
                            onClick={() => handleUpdateStatus(request.leave_id, 'approve')}
                          >
                            Approve
                          </button>
                          <button 
                            className='reject-button'
                            onClick={() => handleUpdateStatus(request.leave_id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {status === 'approved' && <span className='status-approved'>Approved</span>}
                      {status === 'rejected' && <span className='status-rejected'>Rejected</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WardenLeave;
