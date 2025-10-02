import React, { useEffect, useState, useRef, useLayoutEffect, useContext } from 'react';
import axios from 'axios'; // Using axios for consistency
import SimpleCalendar from '../components/Calendar';
import { AuthContext } from '../context/AuthContext'; // 👈 1. Import the AuthContext
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

    const { token } = useContext(AuthContext); // 👈 2. Get the token from the context

    // --- REFS ---
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const isScrollingProgrammatically = useRef(false);

    // --- STATIC DATA & CONFIG ---
    const hostelCheckIn = "23:00";
    const itemHeight = 85;

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

    // --- HELPER FUNCTIONS ---
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
        if (isNaN(date)) return "Invalid Time";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getRemarks = (timeString) => {
        if (!timeString) return "Entry Missing";
        const checkInDate = new Date(timeString);
        if (isNaN(checkInDate)) return "Invalid Time";
        const [limitHour, limitMinute] = hostelCheckIn.split(':').map(Number);
        const cutoff = new Date(checkInDate);
        cutoff.setHours(limitHour, limitMinute, 0, 0);
        return checkInDate > cutoff ? "Late Entry" : "On Time";
    };

    // --- DATA FETCHING EFFECT (UPDATED) ---
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!token) { // 👈 3. Check if the token exists before making the call
                console.error("Auth token not found. Please log in.");
                return;
            }

            setLoading(true);
            setAttendance(null);
            const date = formatDate(selectedDate);

            try {
                const res = await axios.get(`http://localhost:3001/api/attendance?date=${date}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 👈 4. Use the token from the context
                    },
                });

                if (res.data) {
                    const formattedData = {
                        checkIn: res.data.in_time,
                        checkOut: res.data.out_time
                    };
                    setAttendance(formattedData);
                } else {
                    setAttendance(null); // No record found for this date
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setAttendance(null); // Handle 404 gracefully
                } else {
                    console.error("An error occurred while fetching attendance:", error);
                    setAttendance(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedDate, token]); // 👈 5. Add token as a dependency

    // --- SCROLL & UI LOGIC ---
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

