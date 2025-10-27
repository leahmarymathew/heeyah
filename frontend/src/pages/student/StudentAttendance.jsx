// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useLayoutEffect,
//   useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import SimpleCalendar from "../../components/Calendar";
// import { useAuth } from "../../context/AuthContext";
// import "./StudentAttendance.css";

// const API_BASE_URL = "http://localhost:3001";

// export default function StudentAttendance() {
//   const navigate = useNavigate();
//   const { user, token, logout } = useAuth();

//   // --- STATE ---
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [displayDate, setDisplayDate] = useState(new Date());
//   const [attendance, setAttendance] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [markingAttendance, setMarkingAttendance] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [latestLeave, setLatestLeave] = useState(null);
//   const [leaveLoading, setLeaveLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- REFS ---
//   const dayRef = useRef(null);
//   const monthRef = useRef(null);
//   const yearRef = useRef(null);
//   const isScrollingProgrammatically = useRef(false);

//   // --- CONSTANTS ---
//   const itemHeight = 85;
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

//   // --- IST Helpers ---
//   const getCurrentIST = () =>
//     new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
//   const toIST = (dateInput) =>
//     dateInput
//       ? new Date(new Date(dateInput).getTime() + 5.5 * 60 * 60 * 1000)
//       : null;
//   const formatTimeIST = (dateInput) => {
//     const date = toIST(dateInput);
//     if (!date) return "--:--";
//     return date.toLocaleTimeString("en-GB", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };
//   const formatDate = (date) => {
//     if (!date) return "";
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };
//   const formatDisplayDate = (dateInput) => {
//     const date = toIST(dateInput);
//     if (!date) return "N/A";
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const getRemarks = (inTime) => {
//     if (!inTime) return "Entry Missing";
//     const inDate = toIST(inTime);
//     const cutoff = new Date(inDate);
//     cutoff.setHours(23, 0, 0, 0);
//     const nextDayLimit = new Date(cutoff);
//     nextDayLimit.setDate(cutoff.getDate() + 1);
//     nextDayLimit.setHours(4, 0, 0, 0);
//     if (inDate <= cutoff) return "On Time";
//     if (inDate > cutoff && inDate < nextDayLimit) return "Late Entry";
//     return "Very Late";
//   };

//   const getDaysInMonth = (year, month) =>
//     new Date(year, month + 1, 0).getDate();

//   const isTodayOrLateNight = (date) => {
//     const nowIST = getCurrentIST();
//     const today = new Date(
//       nowIST.getFullYear(),
//       nowIST.getMonth(),
//       nowIST.getDate()
//     );
//     const selected = new Date(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     );
//     if (selected.getTime() === today.getTime()) return true;
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     if (selected.getTime() === yesterday.getTime() && nowIST.getHours() < 4)
//       return true;
//     return false;
//   };

//   // --- FETCH ATTENDANCE ---
//   const fetchAttendance = async () => {
//     if (!token || !user?.roll_no) {
//       setError("You are not logged in.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setAttendance(null);

//     try {
//       const dateStr = formatDate(selectedDate);
//       const res = await fetch(
//         `${API_BASE_URL}/api/attendance?date=${dateStr}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.ok) {
//         const data = await res.json();
//         const record = Array.isArray(data)
//           ? data.find((r) => r.student?.roll_no === user.roll_no)
//           : data;
//         setAttendance(
//           record ? { checkIn: record.in_time, checkOut: record.out_time } : null
//         );
//       } else if (res.status === 404) {
//         setAttendance(null);
//       } else {
//         throw new Error(`Failed to fetch attendance: ${res.statusText}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Could not load attendance data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [selectedDate, token, user]);

//   // --- FETCH LATEST LEAVE ---
//   useEffect(() => {
//     const fetchLatestLeave = async () => {
//       if (!token || !user?.roll_no) {
//         setLeaveLoading(false);
//         return;
//       }
//       setLeaveLoading(true);

//       try {
//         const res = await fetch(`${API_BASE_URL}/api/leave/latest`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setLatestLeave(data);
//         } else setLatestLeave(null);
//       } catch (err) {
//         console.error(err);
//         setError("Could not load leave data.");
//       } finally {
//         setLeaveLoading(false);
//       }
//     };
//     fetchLatestLeave();
//   }, [token, user]);

//   // --- CHECK-IN / CHECK-OUT ---
//   // const handleAttendance = async (action) => {
//   //     if (!token || !user?.roll_no) { alert("You are not logged in."); return; }
//   //     setMarkingAttendance(true);
//   //     try {
//   //         const res = await fetch(`${API_BASE_URL}/api/attendance`, {
//   //             method: 'POST',
//   //             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//   //             body: JSON.stringify({ roll_no: user.roll_no, type: action === 'check-in' ? 'in' : 'out' })
//   //         });
//   //         if (res.ok) {
//   //             alert(`${action === 'check-in' ? 'Check-In' : 'Check-Out'} Successful`);
//   //             fetchAttendance();
//   //         } else {
//   //             const errData = await res.json();
//   //             alert(errData.error || "Failed to mark attendance");
//   //         }
//   //     } catch (err) { console.error(err); alert("Error marking attendance"); }
//   //     finally { setMarkingAttendance(false); }
//   // };
//   const handleAttendance = async (action) => {
//     if (!token || !user?.roll_no) {
//       alert("You are not logged in.");
//       return;
//     }

//     // Prevent check-in without check-out
//     if (action === "check-in" && (!attendance || !attendance.checkOut)) {
//       alert("You must check out first before checking in.");
//       return;
//     }

//     setMarkingAttendance(true);
//     try {
//       // POST request
//       const res = await fetch(`${API_BASE_URL}/api/attendance`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           roll_no: user.roll_no,
//           type: action === "check-in" ? "in" : "out",
//         }),
//       });

//       if (res.ok) {
//         alert(`${action === "check-in" ? "Check-In" : "Check-Out"} Successful`);
//         fetchAttendance(); // refresh attendance
//       } else {
//         const errData = await res.json();
//         alert(errData.error || "Failed to mark attendance");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error marking attendance");
//     } finally {
//       setMarkingAttendance(false);
//     }
//   };

//   // --- WHEEL SCROLL LOGIC ---
//   useLayoutEffect(() => {
//     setDisplayDate(selectedDate);
//     const scrollToDate = () => {
//       isScrollingProgrammatically.current = true;
//       const day = selectedDate.getDate();
//       const month = selectedDate.getMonth();
//       const yearIndex = years.indexOf(selectedDate.getFullYear());
//       if (dayRef.current) dayRef.current.scrollTop = (day - 1) * itemHeight;
//       if (monthRef.current) monthRef.current.scrollTop = month * itemHeight;
//       if (yearRef.current && yearIndex !== -1)
//         yearRef.current.scrollTop = yearIndex * itemHeight;
//       setTimeout(() => {
//         isScrollingProgrammatically.current = false;
//       }, 300);
//     };
//     scrollToDate();
//   }, [selectedDate]);

//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         func.apply(null, args);
//       }, delay);
//     };
//   };

//   const commitDateChange = useCallback(
//     debounce((date) => setSelectedDate(date), 250),
//     []
//   );

//   const createScrollHandler = (type) => (event) => {
//     if (isScrollingProgrammatically.current) return;
//     const container = event.target;
//     const index = Math.round(container.scrollTop / itemHeight);
//     const newDisplayDate = new Date(displayDate);
//     if (type === "day") newDisplayDate.setDate(index + 1);
//     else if (type === "month") {
//       const currentDay = newDisplayDate.getDate();
//       newDisplayDate.setMonth(index);
//       const daysInNewMonth = getDaysInMonth(
//         newDisplayDate.getFullYear(),
//         index
//       );
//       if (currentDay > daysInNewMonth) newDisplayDate.setDate(daysInNewMonth);
//     } else if (type === "year") {
//       if (years[index]) newDisplayDate.setFullYear(years[index]);
//     }
//     setDisplayDate(newDisplayDate);
//     commitDateChange(newDisplayDate);
//   };

//   const handleCalendarChange = (date) => {
//     setSelectedDate(date);
//     setShowCalendar(false);
//   };
//   const handleLeaveClick = () => navigate("/student/leave-form");

//   const daysInCurrentMonth = getDaysInMonth(
//     displayDate.getFullYear(),
//     displayDate.getMonth()
//   );
//   const currentDay = displayDate.getDate();
//   const currentMonth = displayDate.getMonth();
//   const currentYear = displayDate.getFullYear();

//   if (error)
//     return (
//       <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
//         <h2>Error</h2>
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <>
//       <div className="attendance-container">
//         {/* DATE WHEELS & CALENDAR */}
//         <div className="date-section">
//           <div className="date-wheels-container">
//             {/* Day Wheel */}
//             <div className="wheel-container">
//               <div
//                 className="wheel day-wheel"
//                 ref={dayRef}
//                 onScroll={createScrollHandler("day")}
//               >
//                 {[...Array(daysInCurrentMonth)].map((_, i) => {
//                   const day = i + 1;
//                   let className = "wheel-item";
//                   const diff = day - currentDay;
//                   if (diff === 0) className += " selected-item";
//                   else if (diff === -1) className += " prev-item";
//                   else if (diff === 1) className += " next-item";
//                   return (
//                     <div key={`day-${day}`} className={className}>
//                       {day}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {/* Month Wheel */}
//             <div className="wheel-container">
//               <div
//                 className="wheel month-wheel"
//                 ref={monthRef}
//                 onScroll={createScrollHandler("month")}
//               >
//                 {months.map((month, i) => {
//                   let className = "wheel-item";
//                   const diff = i - currentMonth;
//                   if (diff === 0) className += " selected-item";
//                   else if (diff === -1) className += " prev-item";
//                   else if (diff === 1) className += " next-item";
//                   return (
//                     <div key={month} className={className}>
//                       {month}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {/* Year Wheel */}
//             <div className="wheel-container">
//               <div
//                 className="wheel year-wheel"
//                 ref={yearRef}
//                 onScroll={createScrollHandler("year")}
//               >
//                 {years.map((year) => {
//                   let className = "wheel-item";
//                   const diff = year - currentYear;
//                   if (diff === 0) className += " selected-item";
//                   else if (diff === -1) className += " prev-item";
//                   else if (diff === 1) className += " next-item";
//                   return (
//                     <div key={year} className={className}>
//                       {year}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="calendar-wrapper">
//             <div
//               className="calendar-icon"
//               onClick={() => setShowCalendar(!showCalendar)}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                 <line x1="16" y1="2" x2="16" y2="6"></line>
//                 <line x1="8" y1="2" x2="8" y2="6"></line>
//                 <line x1="3" y1="10" x2="21" y2="10"></line>
//               </svg>
//             </div>
//             {showCalendar && (
//               <SimpleCalendar
//                 selectedDate={selectedDate}
//                 onChange={handleCalendarChange}
//               />
//             )}
//           </div>
//         </div>

//         {/* ATTENDANCE CARD */}
//         <div className="daily-record">
//           {loading ? (
//             <p className="loading-text">Loading...</p>
//           ) : (
//             <div className="attendance-card">
//               <div className="time-section">
//                 <div>
//                   <p className="time-label">In Time</p>
//                   <p className="time-value">
//                     {attendance ? formatTimeIST(attendance.checkIn) : "--:--"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="time-label">Out Time</p>
//                   <p className="time-value">
//                     {attendance ? formatTimeIST(attendance.checkOut) : "--:--"}
//                   </p>
//                 </div>
//               </div>
//               <hr />
//               <p className="remarks">
//                 <strong>Remarks:</strong>{" "}
//                 {attendance ? getRemarks(attendance.checkIn) : "Entry Missing"}
//               </p>
//               {isTodayOrLateNight(selectedDate) && (
//                 <div className="attendance-buttons">
//                   <button
//                     className="checkout-btn"
//                     onClick={() => handleAttendance("check-out")}
//                     disabled={markingAttendance || !!attendance?.checkOut} // disable while marking or already checked out
//                   >
//                     {attendance?.checkOut ? "Checked Out" : "Check Out"}
//                   </button>

//                   <button
//                     style={{ marginLeft: "1rem" }}
//                     className="checkin-btn"
//                     onClick={() => handleAttendance("check-in")}
//                     disabled={markingAttendance || !!attendance?.checkIn} // disable while marking or already checked in
//                   >
//                     {attendance?.checkIn ? "Checked In" : "Check In"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* LEAVE RECORD */}
//       <div
//         className="leave-record"
//         onClick={handleLeaveClick}
//         style={{ cursor: "pointer" }}
//       >
//         {leaveLoading ? (
//           <p className="loading-text">Loading Leave Record...</p>
//         ) : latestLeave ? (
//           <div className="leave-card">
//             <p className="leave-title">Leave</p>
//             <p className="leave-date">
//               {formatDisplayDate(latestLeave.leave_start_time)}
//             </p>
//             <p className="leave-status">
//               {latestLeave.approved_by ? `Approved` : "Rejected"}
//             </p>
//           </div>
//         ) : (
//           <p className="no-leave-text">No Leave Records Found</p>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SimpleCalendar from "../../components/Calendar";
import { useAuth } from "../../context/AuthContext";
import "./StudentAttendance.css";

const API_BASE_URL = "http://localhost:3001";

export default function StudentAttendance() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [latestLeave, setLatestLeave] = useState(null);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- REFS ---
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);

  // --- CONSTANTS ---
  const itemHeight = 85;
  const months = [
    "January","February","March","April","May","June","July",
    "August","September","October","November","December"
  ];
  const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

  // --- IST Helpers ---
  const getCurrentIST = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const toIST = (dateInput) => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const formatTimeIST = (dateInput) => {
    if (!dateInput) return "--:--";
    
    // Since backend now stores IST time, just format it directly
    const date = new Date(dateInput);
    
    // Format in 24-hour format without AM/PM
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateInput) => {
    const date = toIST(dateInput);
    if (!date) return "N/A";
    return `${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth()+1).padStart(2,"0")}/${date.getFullYear()}`;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const getRemarks = (inTime) => {
    if (!inTime) return "Entry Missing";
    const inDate = toIST(inTime);
    const cutoff = new Date(inDate);
    cutoff.setHours(23,0,0,0);
    const nextDayLimit = new Date(cutoff);
    nextDayLimit.setDate(cutoff.getDate() + 1);
    nextDayLimit.setHours(4,0,0,0);

    if (inDate <= cutoff) return "On Time";
    if (inDate > cutoff && inDate < nextDayLimit) return "Late Entry";
    return "Very Late";
  };

  const isTodayOrLateNight = (date) => {
    const nowIST = getCurrentIST();
    const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
    const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (selected.getTime() === today.getTime()) return true;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (selected.getTime() === yesterday.getTime() && nowIST.getHours() < 4) return true;

    return false;
  };

  // --- FETCH ATTENDANCE ---
  const fetchAttendance = async () => {
    if (!user?.roll_no) { setError("You are not logged in."); setLoading(false); return; }
    setLoading(true); setError(null); setAttendance(null);
    try {
      const dateStr = formatDate(selectedDate);
      // Use simple API call with roll number
      const res = await fetch(`${API_BASE_URL}/api/students/attendance/simple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: user.roll_no, studentName: user.name })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Find attendance record for the selected date
        const record = Array.isArray(data) ? data.find(r => {
          const recordDate = new Date(r.date);
          const selectedDateStr = formatDate(selectedDate);
          const recordDateStr = formatDate(recordDate);
          return recordDateStr === selectedDateStr;
        }) : null;
        
        // If viewing today and no record exists, create empty attendance object for button logic
        const today = formatDate(new Date());
        const selectedDateStr = formatDate(selectedDate);
        
        if (selectedDateStr === today && !record) {
          // For today's date with no record, set empty attendance to enable buttons
          setAttendance({ checkIn: null, checkOut: null });
        } else {
          // For other dates or when record exists, use the found record
          setAttendance(record ? { checkIn: record.in_time, checkOut: record.out_time } : null);
        }
      } else if (res.status === 404) {
        setAttendance(null);
      } else throw new Error(`Failed to fetch attendance: ${res.statusText}`);
    } catch (err) { console.error(err); setError("Could not load attendance data."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAttendance(); }, [selectedDate, user]);

  // --- FETCH LATEST LEAVE ---
  useEffect(() => {
    const fetchLatestLeave = async () => {
      if (!user?.roll_no) { setLeaveLoading(false); return; }
      setLeaveLoading(true);
      try {
        // Simple leave fetch - for now just set to null since we don't have this endpoint yet
        setLatestLeave(null);
      } catch (err) { console.error(err); setError("Could not load leave data."); }
      finally { setLeaveLoading(false); }
    };
    fetchLatestLeave();
  }, [user]);

  // --- CHECK-IN / CHECK-OUT ---
  const handleAttendance = async (action) => {
    if (!user?.roll_no) { alert("You are not logged in."); return; }

    setMarkingAttendance(true);
    try {
      // Simple attendance marking
      const res = await fetch(`${API_BASE_URL}/api/students/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rollNo: user.roll_no, 
          studentName: user.name,
          type: action === "check-in" ? "in" : "out" 
        })
      });

      if (res.ok) { 
        alert(`${action === "check-in" ? "Check-In" : "Check-Out"} Successful`); 
        fetchAttendance(); 
      } else { 
        const errData = await res.json(); 
        alert(errData.error || "Failed to mark attendance"); 
      }
    } catch (err) { console.error(err); alert("Error marking attendance"); }
    finally { setMarkingAttendance(false); }
  };

  const canCheckOut = () => { 
    // Can check out if no attendance record or if not already checked out
    if (!attendance) return true; 
    return !attendance.checkOut; 
  };
  
  const canCheckIn = () => { 
    // Can check in if there's an attendance record and already checked out but not checked in
    if (!attendance) return false; 
    return !!attendance.checkOut && !attendance.checkIn; 
  };

  // --- DATE WHEEL HANDLERS ---
  useLayoutEffect(() => {
    setDisplayDate(selectedDate);
    const scrollToDate = () => {
      isScrollingProgrammatically.current = true;
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth();
      const yearIndex = years.indexOf(selectedDate.getFullYear());
      if (dayRef.current) dayRef.current.scrollTop = (day - 1) * itemHeight;
      if (monthRef.current) monthRef.current.scrollTop = month * itemHeight;
      if (yearRef.current && yearIndex !== -1) yearRef.current.scrollTop = yearIndex * itemHeight;
      setTimeout(() => { isScrollingProgrammatically.current = false; }, 300);
    };
    scrollToDate();
  }, [selectedDate]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(null,args); }, delay); };
  };
  const commitDateChange = useCallback(debounce((date) => setSelectedDate(date), 250), []);

  const createScrollHandler = (type) => (event) => {
    if (isScrollingProgrammatically.current) return;
    const container = event.target;
    const index = Math.round(container.scrollTop / itemHeight);
    const newDisplayDate = new Date(displayDate);
    if (type === "day") newDisplayDate.setDate(index + 1);
    else if (type === "month") {
      const currentDay = newDisplayDate.getDate();
      newDisplayDate.setMonth(index);
      const daysInNewMonth = getDaysInMonth(newDisplayDate.getFullYear(), index);
      if (currentDay > daysInNewMonth) newDisplayDate.setDate(daysInNewMonth);
    } else if (type === "year") {
      if (years[index]) newDisplayDate.setFullYear(years[index]);
    }
    setDisplayDate(newDisplayDate);
    commitDateChange(newDisplayDate);
  };

  const handleCalendarChange = (date) => { setSelectedDate(date); setShowCalendar(false); };
  const handleLeaveClick = () => navigate("/student/leave-form");

  const daysInCurrentMonth = getDaysInMonth(displayDate.getFullYear(), displayDate.getMonth());
  const currentDay = displayDate.getDate();
  const currentMonth = displayDate.getMonth();
  const currentYear = displayDate.getFullYear();

  if (error) return <div style={{ textAlign:"center", padding:"2rem", color:"red" }}><h2>Error</h2><p>{error}</p></div>;

  return (
    <>
      <div className="attendance-container">
        {/* DATE WHEELS & CALENDAR */}
        <div className="date-section">
          <div className="date-wheels-container">
            {/* Day Wheel */}
            <div className="wheel-container">
              <div className="wheel day-wheel" ref={dayRef} onScroll={createScrollHandler("day")}>
                {[...Array(daysInCurrentMonth)].map((_, i) => {
                  const day = i + 1;
                  let className = "wheel-item";
                  const diff = day - currentDay;
                  if (diff === 0) className += " selected-item";
                  else if (diff === -1) className += " prev-item";
                  else if (diff === 1) className += " next-item";
                  return <div key={`day-${day}`} className={className}>{day}</div>;
                })}
              </div>
            </div>
            {/* Month Wheel */}
            <div className="wheel-container">
              <div className="wheel month-wheel" ref={monthRef} onScroll={createScrollHandler("month")}>
                {months.map((month, i) => {
                  let className = "wheel-item";
                  const diff = i - currentMonth;
                  if (diff === 0) className += " selected-item";
                  else if (diff === -1) className += " prev-item";
                  else if (diff === 1) className += " next-item";
                  return <div key={month} className={className}>{month}</div>;
                })}
              </div>
            </div>
            {/* Year Wheel */}
            <div className="wheel-container">
              <div className="wheel year-wheel" ref={yearRef} onScroll={createScrollHandler("year")}>
                {years.map(year => {
                  let className = "wheel-item";
                  const diff = year - currentYear;
                  if (diff === 0) className += " selected-item";
                  else if (diff === -1) className += " prev-item";
                  else if (diff === 1) className += " next-item";
                  return <div key={year} className={className}>{year}</div>;
                })}
              </div>
            </div>
          </div>

          <div className="calendar-wrapper">
            <div className="calendar-icon" onClick={() => setShowCalendar(!showCalendar)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            {showCalendar && <SimpleCalendar selectedDate={selectedDate} onChange={handleCalendarChange} />}
          </div>
        </div>

        {/* ATTENDANCE CARD */}
        <div className="daily-record">
          {loading ? <p className="loading-text">Loading...</p> :
            <div className="attendance-card">
              <div className="time-section">
                <div>
                  <p className="time-label">In Time</p>
                  <p className="time-value">{attendance ? formatTimeIST(attendance.checkIn) : "--:--"}</p>
                </div>
                <div>
                  <p className="time-label">Out Time</p>
                  <p className="time-value">{attendance ? formatTimeIST(attendance.checkOut) : "--:--"}</p>
                </div>
              </div>
              <hr />
              <p className="remarks"><strong>Remarks:</strong> {attendance ? getRemarks(attendance.checkIn) : "Entry Missing"}</p>

              {isTodayOrLateNight(selectedDate) && (
                <div className="attendance-buttons">
                  <button className="checkout-btn" onClick={() => handleAttendance("check-out")} disabled={markingAttendance || !canCheckOut()}>
                    {attendance?.checkOut ? "Checked Out" : "Check Out"}
                  </button>

                  <button style={{ marginLeft: "1rem" }} className="checkin-btn" onClick={() => handleAttendance("check-in")} disabled={markingAttendance || !canCheckIn()}>
                    {attendance?.checkIn ? "Checked In" : "Check In"}
                  </button>
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {/* LEAVE RECORD */}
      <div className="leave-record" onClick={handleLeaveClick} style={{ cursor: "pointer" }}>
        {leaveLoading ? <p className="loading-text">Loading Leave Record...</p> :
          latestLeave ? (
            <div className="leave-card">
              <p className="leave-title">Leave</p>
              <p className="leave-date">{formatDisplayDate(latestLeave.leave_start_time)}</p>
              <p className="leave-status">{latestLeave.approved_by ? "Approved" : "Rejected"}</p>
            </div>
          ) : <p className="no-leave-text">Leave</p>
        }
      </div>
    </>
  );
}
