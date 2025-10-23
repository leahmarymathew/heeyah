import './WardenAttendance.css';
import { useState } from 'react';
import Navbar from "../../components/Navbar";
import back from "../../assets/Arrow 1.png";

// --- CHANGE 1: Import your actual Calendar component ---
import SimpleCalendar from '../../components/Calendar'; 
// (Adjust path if needed)


function WardenAttendance() {
    const formatDateForDisplay = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const allAttendanceData = [
      // Data for Oct 21, 2025
      { "id": 1, "date": "2025-10-21", "studentName": "Leah Mathew", "studentId": "#2123123", "checkOutTime": "08:15 AM", "checkInTime": "05:37 PM", "status": "Present" },
      { "id": 2, "date": "2025-10-21", "studentName": "John Doe", "studentId": "#2123125", "checkOutTime": "09:00 AM", "checkInTime": "06:00 PM", "status": "Present" },
      { "id": 3, "date": "2025-10-21", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:00 PM", "checkInTime": "11:45 PM", "status": "Late" },
      { "id": 4, "date": "2025-10-21", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      { "id": 5, "date": "2025-10-21", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:00 PM", "checkInTime": "11:45 PM", "status": "Late" },
      { "id": 6, "date": "2025-10-21", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      { "id": 7, "date": "2025-10-21", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:00 PM", "checkInTime": "11:45 PM", "status": "Late" },
      { "id": 8, "date": "2025-10-21", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      { "id": 9, "date": "2025-10-21", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:00 PM", "checkInTime": "11:45 PM", "status": "Late" },
      { "id": 10, "date": "2025-10-21", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      { "id": 11, "date": "2025-10-21", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:00 PM", "checkInTime": "11:45 PM", "status": "Late" },
      { "id": 12, "date": "2025-10-21", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      
      // Data for Oct 22, 2025
      { "id": 21, "date": "2025-10-22", "studentName": "Leah Mathew", "studentId": "#2123123", "checkOutTime": "08:20 AM", "checkInTime": "05:40 PM", "status": "Present" },
      { "id": 22, "date": "2025-10-22", "studentName": "Priya Sharma", "studentId": "#2022BME0012", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "Remarked" },
      { "id": 23, "date": "2025-10-22", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:05 PM", "checkInTime": "09:00 PM", "status": "Present" },
      { "id": 24, "date": "2025-10-22", "studentName": "Abhishek R", "studentId": "#2023BCY0049", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "On Leave" },
      { "id": 25, "date": "2025-10-22", "studentName": "Leah Mathew", "studentId": "#2123123", "checkOutTime": "08:20 AM", "checkInTime": "05:40 PM", "status": "Present" },
      { "id": 26, "date": "2025-10-22", "studentName": "Priya Sharma", "studentId": "#2022BME0012", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "Remarked" },
      { "id": 27, "date": "2025-10-22", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:05 PM", "checkInTime": "09:00 PM", "status": "Present" },
      { "id": 28, "date": "2025-10-22", "studentName": "Leah Mathew", "studentId": "#2123123", "checkOutTime": "08:20 AM", "checkInTime": "05:40 PM", "status": "Present" },
      { "id": 29, "date": "2025-10-22", "studentName": "Priya Sharma", "studentId": "#2022BME0012", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "Remarked" },
      { "id": 30, "date": "2025-10-22", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:05 PM", "checkInTime": "09:00 PM", "status": "Present" },
      { "id": 31, "date": "2025-10-22", "studentName": "Leah Mathew", "studentId": "#2123123", "checkOutTime": "08:20 AM", "checkInTime": "05:40 PM", "status": "Present" },
      { "id": 32, "date": "2025-10-22", "studentName": "Priya Sharma", "studentId": "#2022BME0012", "checkOutTime": "N/A", "checkInTime": "N/A", "status": "Remarked" },
      { "id": 33, "date": "2025-10-22", "studentName": "Vikram Singh", "studentId": "#2211078", "checkOutTime": "04:05 PM", "checkInTime": "09:00 PM", "status": "Present" },
    ];

    // Formats the Date object into "YYYY-MM-DD" for filtering
    const formatDateForFilter = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // This handler now receives a Date OBJECT from SimpleCalendar
    const handleDateChange = (newDate) => {
        setSelectedDate(new Date(newDate)); 
        setIsCalendarOpen(false); 
    };

    // --- CHANGE 4: Update filter to use the new helper function ---
    const filteredAttendanceData = allAttendanceData.filter(
        (record) => record.date === formatDateForFilter(selectedDate)
    );

    const statusStyles = {
        Present: 'present',
        Late: 'late',
        'On Leave': 'leave',
        Remarked: 'remark',
        Default: 'default'
    };
    
    return (
        <>
            <Navbar />
            <div className="main"> 
                <button type="button" className="image-button">
                    <img 
                        src={back}
                        alt="Back" 
                        width="30px"
                    />
                </button>
                <div className="warden-attendance-container">
                    
                    <div className="attendance-header">
                        <p className='head'>Attendance Sheet</p>
                        <div className="date-changer">
                            <span>Date: {formatDateForDisplay(selectedDate)}</span>
                            <button onClick={() => setIsCalendarOpen(true)}>Change Date</button>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Check-out Time</th>
                                <th>Check-in Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendanceData.length > 0 ? (
                                filteredAttendanceData.map((record, index) => {
                                    const baseClasses = 'status-badge'; 
                                    const dynamicClasses = statusStyles[record.status] || statusStyles.Default;

                                    return (
                                        <tr key={record.id}>
                                            <td>{index + 1}</td>
                                            <td>{record.studentName}</td>
                                            <td>{record.studentId}</td>
                                            <td>{record.checkOutTime}</td>
                                            <td>{record.checkInTime}</td>
                                            <td className={`${baseClasses} ${dynamicClasses}`}>{record.status}</td>
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