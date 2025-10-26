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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WardenLayout from '../../components/WardenLayout';
import back from "../../assets/Arrow 1.png";
import './WardenLeave.css';

function WardenLeave() {
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: 'Abhishek R',
      rollNo: '2023BCY0049',
      startDate: '2025-02-01',
      endDate: '2025-02-04',
      reason: 'Going home for family function',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rollNo: '2022BME0012',
      startDate: '2025-01-28',
      endDate: '2025-01-29',
      reason: 'Attending wedding',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Karan Singh',
      rollNo: '2024BEE0088',
      startDate: '2025-02-05',
      endDate: '2025-02-05',
      reason: 'Medical appointment',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Anjali Mehta',
      rollNo: '2023BCS0150',
      startDate: '2025-01-25',
      endDate: '2025-01-27',
      reason: 'Personal reasons',
      status: 'rejected'
    },
    {
      id: 5,
      name: 'Rohit Kumar',
      rollNo: '2023BCS0019',
      startDate: '2025-02-10',
      endDate: '2025-02-12',
      reason: 'Family function',
      status: 'pending'
    }
  ]);

  const handleBack = () => {
    navigate('/warden-dashboard');
  };

  const handleUpdateStatus = (id, newStatus) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <WardenLayout>
      <div className="warden-leave-main">
        <div className="warden-leave-header">
          <button type="button" className="back-button" onClick={handleBack}>
            <img src={back} alt="Back" width="24px" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="page-title">Leave Requests</h1>
        </div>

        <div className="warden-leave-container">
          <div className="table-container">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="applicant-cell">
                      <div className="applicant-info">
                        <strong>{request.name}</strong>
                        <span className="roll-no">Roll No: {request.rollNo}</span>
                      </div>
                    </td>
                    <td className="details-cell">
                      <div className="leave-details">
                        <div><strong>From:</strong> {request.startDate}</div>
                        <div><strong>To:</strong> {request.endDate}</div>
                        <div><strong>Reason:</strong> {request.reason}</div>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${request.status}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {request.status === 'pending' ? (
                        <div className="action-buttons">
                          <button 
                            className="approve-btn"
                            onClick={() => handleUpdateStatus(request.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`final-status status-${request.status}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
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

export default WardenLeave;
