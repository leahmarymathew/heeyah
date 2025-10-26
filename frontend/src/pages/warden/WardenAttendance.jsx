
// import './WardenAttendance.css';
// import { useState, useEffect } from 'react';
// import back from "../../assets/Arrow 1.png";
// import SimpleCalendar from '../../components/Calendar';
// import axios from 'axios'; // add axios

// function WardenAttendance() {
//     const formatDateForDisplay = (date) => {
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const formatDateForFilter = (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     const today = new Date();
//     const [selectedDate, setSelectedDate] = useState(today);
//     const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // ✅ Fetch attendance from backend
//     const fetchAttendance = async (date) => {
//         try {
//             setLoading(true);
//             setError(null);

//             const formattedDate = formatDateForFilter(date);

//             const response = await axios.get(
//                 `http://localhost:3001/api/attendance?date=${formattedDate}`,
//                 {
//                     withCredentials: true,
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//                     },
//                 }
//             );
//             setAttendanceData(response.data || []);
//         } catch (err) {
//             console.error('Error fetching attendance:', err);
//             setError(err.response?.data?.error || 'Failed to load attendance data.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendance(selectedDate);
//     }, [selectedDate]);

//     const handleDateChange = (newDate) => {
//         setSelectedDate(new Date(newDate));
//         setIsCalendarOpen(false);
//     };

//     const statusStyles = {
//         Present: 'present',
//         Late: 'late',
//         'On Leave': 'leave',
//         'Out Pending': 'pending',
//         Remarked: 'remark',
//         Default: 'default'
//     };

//     const computeStatus = (record) => {
//         const selectedDayStart = new Date(selectedDate);
//         selectedDayStart.setHours(0, 0, 0, 0);

//         const selectedDayEnd = new Date(selectedDayStart);
//         selectedDayEnd.setHours(23, 59, 59, 999);

//         const inTime = record.in_time ? new Date(record.in_time) : null;
//         const outTime = record.out_time ? new Date(record.out_time) : null;

//         if (!inTime) {
//             return 'On Leave';
//         }

//         // In-time within same day
//         if (inTime >= selectedDayStart && inTime <= selectedDayEnd) {
//             if (inTime.getHours() >= 23) return 'Late';
//             if (outTime) return 'Present';
//             return 'Out Pending';
//         }

//         // In-time after midnight (0:00-2:00) counts as late for previous day
//         if (inTime > selectedDayEnd && inTime.getHours() < 2) return 'Late';

//         return 'On Leave';
//     };

//     return (
//         <>
//             <div className="main">
//                 <button type="button" className="image-button">
//                     <img src={back} alt="Back" width="30px" />
//                 </button>

//                 <div className="warden-attendance-container">
//                     <div className="attendance-header">
//                         <p className="head">Attendance Sheet</p>
//                         <div className="date-changer">
//                             <span>Date: {formatDateForDisplay(selectedDate)}</span>
//                             <button onClick={() => setIsCalendarOpen(true)}>Change Date</button>
//                         </div>
//                     </div>

//                     {loading ? (
//                         <p>Loading attendance...</p>
//                     ) : error ? (
//                         <p className="error">{error}</p>
//                     ) : (
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Student Name</th>
//                                     <th>Roll No</th>
//                                     <th>Check-out Time</th>
//                                     <th>Check-in Time</th>
//                                     <th>Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {attendanceData.length > 0 ? (
//                                     attendanceData.map((record, index) => {
//                                         const status = computeStatus(record);
//                                         const dynamicClasses = statusStyles[status] || statusStyles.Default;

//                                         return (
//                                             <tr key={record.attendance_id || index}>
//                                                 <td>{index + 1}</td>
//                                                 <td>{record.student?.name || '—'}</td>
//                                                 <td>{record.student?.roll_no || record.roll_no || '—'}</td>
//                                                 <td>{record.out_time ? new Date(record.out_time).toLocaleTimeString() : 'N/A'}</td>
//                                                 <td>{record.in_time ? new Date(record.in_time).toLocaleTimeString() : 'N/A'}</td>
//                                                 <td className={`status-badge ${dynamicClasses}`}>{status}</td>
//                                             </tr>
//                                         );
//                                     })
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="6" className="no-data-cell">
//                                             No attendance data available for {formatDateForDisplay(selectedDate)}.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>

//             {isCalendarOpen && (
//                 <div className="calendar-modal-backdrop" onClick={() => setIsCalendarOpen(false)}>
//                     <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
//                         <SimpleCalendar
//                             selectedDate={selectedDate}
//                             onChange={handleDateChange}
//                             onClose={() => setIsCalendarOpen(false)}
//                         />
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default WardenAttendance;

import './WardenAttendance.css';
import { useState, useEffect } from 'react';
import back from "../../assets/Arrow 1.png";
import SimpleCalendar from '../../components/Calendar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // useAuth for token

function WardenAttendance() {
    const { token } = useAuth(); // fetch token from context

    const formatDateForDisplay = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateForFilter = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const statusStyles = {
        Present: 'present',
        Late: 'late',
        'On Leave': 'leave',
        'Out Pending': 'pending',
        Remarked: 'remark',
        Default: 'default'
    };

    // --- IST conversion helper ---
    const toISTDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const istOffset = 5.5 * 60; // IST = UTC +5:30 in minutes
        return new Date(date.getTime() + istOffset * 60000);
    };

    const computeStatus = (record) => {
        const selectedDayStart = new Date(selectedDate);
        selectedDayStart.setHours(0, 0, 0, 0);

        const selectedDayEnd = new Date(selectedDayStart);
        selectedDayEnd.setHours(23, 59, 59, 999);

        const inTime = toISTDate(record.in_time);
        const outTime = toISTDate(record.out_time);

        if (!inTime) return 'On Leave';

        // In-time within same day
        if (inTime >= selectedDayStart && inTime <= selectedDayEnd) {
            if (inTime.getHours() >= 23) return 'Late';       // after 11 PM IST
            if (outTime) return 'Present';                    // has check-out
            return 'Out Pending';                             // not checked out yet
        }

        // In-time after midnight (0:00-2:00 IST) counts as late for previous day
        if (inTime > selectedDayEnd && inTime.getHours() < 2) return 'Late';

        return 'On Leave';
    };

    const fetchAttendance = async (date) => {
        if (!token) {
            setError('Not authorized. Please login.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const formattedDate = formatDateForFilter(date);

            const response = await axios.get(
                `http://localhost:3001/api/attendance?date=${formattedDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            setAttendanceData(response.data || []);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError(err.response?.data?.error || 'Failed to load attendance data.');
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, [selectedDate, token]);

    const handleDateChange = (newDate) => {
        setSelectedDate(new Date(newDate));
        setIsCalendarOpen(false);
    };

    return (
        <>
            <div className="main">
                <button type="button" className="image-button">
                    <img src={back} alt="Back" width="30px" />
                </button>

                <div className="warden-attendance-container">
                    <div className="attendance-header">
                        <p className="head">Attendance Sheet</p>
                        <div className="date-changer">
                            <span>Date: {formatDateForDisplay(selectedDate)}</span>
                            <button onClick={() => setIsCalendarOpen(true)}>Change Date</button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading attendance...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Roll No</th>
                                    <th>Check-out Time</th>
                                    <th>Check-in Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.length > 0 ? (
                                    attendanceData.map((record, index) => {
                                        const status = computeStatus(record);
                                        const dynamicClasses = statusStyles[status] || statusStyles.Default;

                                        return (
                                            <tr key={record.attendance_id || index}>
                                                <td>{index + 1}</td>
                                                <td>{record.student?.name || '—'}</td>
                                                <td>{record.student?.roll_no || record.roll_no || '—'}</td>
                                                <td>{record.out_time ? toISTDate(record.out_time).toLocaleTimeString() : 'N/A'}</td>
                                                <td>{record.in_time ? toISTDate(record.in_time).toLocaleTimeString() : 'N/A'}</td>
                                                <td className={`status-badge ${dynamicClasses}`}>{status}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data-cell">
                                            No attendance data available for {formatDateForDisplay(selectedDate)}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isCalendarOpen && (
                <div className="calendar-modal-backdrop" onClick={() => setIsCalendarOpen(false)}>
                    <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                        <SimpleCalendar
                            selectedDate={selectedDate}
                            onChange={handleDateChange}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default WardenAttendance;
