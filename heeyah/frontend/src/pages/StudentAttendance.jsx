import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import SimpleCalendar from '../components/Calendar';
import Navbar from '../components/Navbar';
import './StudentAttendance.css';

// Main App Component
export default function StudentAttendance() {
    // --- STATE MANAGEMENT ---
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [displayDate, setDisplayDate] = useState(today); 
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    // --- REFS ---
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const isScrollingProgrammatically = useRef(false);

    // --- STATIC DATA & CONFIG ---
    const hostelCheckIn = "23:00";
    const itemHeight = 85;

    // --- DELETED --- The sampleAttendance object is no longer needed.

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

    // --- HELPER FUNCTIONS (No changes here) ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return "--:--";
        const date = new Date(timeString);
        if (isNaN(date)) {
            return "Invalid Time";
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getRemarks = (timeString) => {
        if (!timeString) {
            return "Entry Missing";
        }
        const checkInDate = new Date(timeString);
        if (isNaN(checkInDate)) {
            return "Invalid Time";
        }
        const [limitHour, limitMinute] = hostelCheckIn.split(':').map(Number);
        const cutoff = new Date(checkInDate);
        cutoff.setHours(limitHour, limitMinute, 0, 0);
        return checkInDate > cutoff ? "Late Entry" : "On Time";
    };

    // --- DATA FETCHING EFFECT (THIS IS THE MAIN CHANGE) ---
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            setAttendance(null); // Clear previous data

            const date = formatDate(selectedDate);
            
            // ===================================================================
            // IMPORTANT: For testing, paste the token you got from Postman here.
            // When your login page is ready, you will get this from localStorage.
            // ===================================================================
            const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imo2YUV2WFJIeTU0REdkZG4iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ZvenJ0d2xqcG9hcGxwamZzZ2FwLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxYzIzOTRiYS0yNTIyLTQ2NGMtOGJhOS0xZWQ3NmMyZTcwZmUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4Mzk0Nzc1LCJpYXQiOjE3NTgzOTExNzUsImVtYWlsIjoidGVzdC5zdHVkZW5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1ODM5MTE3NX1dLCJzZXNzaW9uX2lkIjoiYzA0YjczNWQtOWZmZS00OTRjLTllZWYtM2FkNzM1NWJjNmIxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.8_S89FylD6LfQAlszffNjc3tV8AzJ9fpGIgYSFNaXJc';
            
            if (!token) {
                console.error("Auth token not found. Please log in to test.");
                setLoading(false);
                return; // Stop if there's no token
            }

            try {
                const res = await fetch(`http://localhost:5000/api/attendance?date=${date}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Your server's 'protect' middleware requires this token
                        'Authorization': `Bearer ${token}` 
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    // Map backend fields (in_time, out_time) to frontend state (checkIn, checkOut)
                    const formattedData = data ? {
                        checkIn: data.in_time,
                        checkOut: data.out_time
                    } : null;
                    setAttendance(formattedData);
                } else if (res.status === 404) {
                    // 404 means no record was found, which is a valid case.
                    setAttendance(null);
                } else {
                    // Handle other errors like 401 Unauthorized (bad token)
                    console.error("Failed to fetch attendance:", res.statusText);
                    setAttendance(null);
                }
            } catch (error) {
                console.error("An error occurred while fetching attendance:", error);
                setAttendance(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedDate]); // This effect re-runs whenever the selectedDate changes


    // --- SCROLL & UI LOGIC (No changes below this line) ---
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

            setTimeout(() => {
                isScrollingProgrammatically.current = false;
            }, 300);
        };

        scrollToDate();
    }, [selectedDate]);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const commitDateChange = React.useCallback(debounce((date) => {
        setSelectedDate(date);
    }, 250), []);

    const createScrollHandler = (type) => (event) => {
        if (isScrollingProgrammatically.current) return;
        const container = event.target;
        const index = Math.round(container.scrollTop / itemHeight);
        const newDisplayDate = new Date(displayDate);

        if (type === 'day') {
            newDisplayDate.setDate(index + 1);
        } else if (type === 'month') {
            const currentDay = newDisplayDate.getDate();
            newDisplayDate.setMonth(index);
            const daysInNewMonth = getDaysInMonth(newDisplayDate.getFullYear(), index);
            if (currentDay > daysInNewMonth) {
                newDisplayDate.setDate(daysInNewMonth);
            }
        } else if (type === 'year') {
            if (years[index]) newDisplayDate.setFullYear(years[index]);
        }

        setDisplayDate(newDisplayDate);
        commitDateChange(newDisplayDate);
    };

    const handleCalendarChange = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };
    
    const daysInCurrentMonth = getDaysInMonth(displayDate.getFullYear(), displayDate.getMonth());
    const currentDay = displayDate.getDate();
    const currentMonth = displayDate.getMonth();
    const currentYear = displayDate.getFullYear();

    return (
        <>
            <Navbar />
            <div className="attendance-container">
                <div className="blob-container">
                    <div className="shape-blob"></div>
                    <div className="shape-blob one"></div>
                    <div className="shape-blob two"></div>
                    <div className="shape-blob three"></div>
                </div>
                <div className="date-section">
                    <div className="date-wheels-container">
                        {/* Day Wheel */}
                        <div className="wheel-container">
                            <div className="wheel day-wheel" ref={dayRef} onScroll={createScrollHandler('day')}>
                                {[...Array(daysInCurrentMonth)].map((_, i) => {
                                    const day = i + 1;
                                    const diff = day - currentDay;
                                    let className = 'wheel-item';
                                    if (diff === 0) className += ' selected-item';
                                    else if (diff === -1) className += ' prev-item';
                                    else if (diff === 1) className += ' next-item';
                                    return <div key={`day-${day}`} className={className}>{day}</div>;
                                })}
                            </div>
                        </div>

                        {/* Month Wheel */}
                        <div className="wheel-container month-wheel-container">
                            <div className="wheel month-wheel" ref={monthRef} onScroll={createScrollHandler('month')}>
                                {months.map((month, i) => {
                                    const diff = i - currentMonth;
                                    let className = 'wheel-item';
                                    if (diff === 0) className += ' selected-item';
                                    else if (diff === -1) className += ' prev-item';
                                    else if (diff === 1) className += ' next-item';
                                    return <div key={month} className={className}>{month}</div>;
                                })}
                            </div>
                        </div>

                        {/* Year Wheel */}
                        <div className="wheel-container">
                            <div className="wheel year-wheel" ref={yearRef} onScroll={createScrollHandler('year')}>
                                {years.map((year) => {
                                    const diff = year - currentYear;
                                    let className = 'wheel-item';
                                    if (diff === 0) className += ' selected-item';
                                    else if (diff === -1) className += ' prev-item';
                                    else if (diff === 1) className += ' next-item';
                                    return <div key={year} className={className}>{year}</div>;
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Icon and Popup */}
                    <div className="calendar-wrapper">
                        <div className="calendar-icon" onClick={() => setShowCalendar(!showCalendar)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        {showCalendar && ( <SimpleCalendar selectedDate={selectedDate} onChange={handleCalendarChange} /> )}
                    </div>
                </div>

                {/* --- ATTENDANCE RECORDS --- */}
                <div className="daily-record">
                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    <div className="attendance-card">
                        <div className="time-section">
                            <div>
                                <p className="time-label">In Time</p>
                                <p className="time-value">{attendance ? formatTime(attendance.checkIn) : '--:--'}</p>
                            </div>
                            <div>
                                <p className="time-label">Out Time</p>
                                <p className="time-value">{attendance ? formatTime(attendance.checkOut) : '--:--'}</p>
                            </div>
                        </div>
                        <hr />
                        <p className="remarks">
                            <strong>Remarks:</strong> {attendance ? getRemarks(attendance.checkIn) : 'Entry Missing'}
                        </p>
                    </div>
                )}
            </div>
            </div>
            <div className="leave-record">
                <p className="leave">Leave Record</p>
                <div className="leave-section">
                    <div className="date-section">
                        <p className="date"></p>
                    </div>
                    <div className="remarks-section">
                        <p className="remarks"></p>
                    </div>
                </div>
            </div>
        </>
    );
}