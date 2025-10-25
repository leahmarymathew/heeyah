import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleCalendar from '../../components/Calendar';
import './StudentAttendance.css';

const API_BASE_URL = 'http://localhost:3001';

export default function StudentAttendance() {
    const navigate = useNavigate();

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [displayDate, setDisplayDate] = useState(today);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [latestLeave, setLatestLeave] = useState(null);
    const [leaveLoading, setLeaveLoading] = useState(true);
    const [error, setError] = useState(null);

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const isScrollingProgrammatically = useRef(false);

    const hostelCheckIn = "23:00";
    const itemHeight = 85;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

    const formatLeaveDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

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

    // --- FETCH ATTENDANCE ---
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            setAttendance(null);

            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("You are not logged in.");
                setLoading(false);
                return;
            }

            try {
                const date = formatDate(selectedDate);
                const res = await fetch(`${API_BASE_URL}/api/attendance?date=${date}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setAttendance(data ? { checkIn: data.in_time, checkOut: data.out_time } : null);
                } else if (res.status === 404) {
                    setAttendance(null);
                } else {
                    throw new Error(`Failed to fetch attendance: ${res.statusText}`);
                }
            } catch (err) {
                console.error(err);
                setError("Could not load attendance data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedDate]);

    // --- FETCH LATEST LEAVE ---
    useEffect(() => {
        const fetchLatestLeave = async () => {
            setLeaveLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                setLeaveLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/leave/latest`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setLatestLeave(data);
                } else if (res.status === 404) {
                    setLatestLeave(null);
                } else {
                    throw new Error(`Failed to fetch leave record: ${res.statusText}`);
                }
            } catch (err) {
                console.error(err);
                setError("Could not load leave data.");
            } finally {
                setLeaveLoading(false);
            }
        };

        fetchLatestLeave();
    }, []);

    // --- SCROLL LOGIC ---
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
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(null, args); }, delay);
        };
    };

    const commitDateChange = useCallback(debounce((date) => {
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
            if (currentDay > daysInNewMonth) newDisplayDate.setDate(daysInNewMonth);
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

    // ✅ Navigate to /student/leave-form
    const handleLeaveClick = () => {
        navigate('/student/leave-form');
    };

    const daysInCurrentMonth = getDaysInMonth(displayDate.getFullYear(), displayDate.getMonth());
    const currentDay = displayDate.getDate();
    const currentMonth = displayDate.getMonth();
    const currentYear = displayDate.getFullYear();

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="attendance-container">
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
                        <div className="wheel-container">
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

                    {/* Calendar */}
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

                {/* Attendance */}
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

            {/* Leave Section */}
            <div
                className="leave-record"
                onClick={handleLeaveClick}
                style={{ cursor: 'pointer' }}
            >
                {leaveLoading ? (
                    <p className="loading-text">Loading Leave Record...</p>
                ) : latestLeave ? (
                    <div className="leave-card">
                        <p className="leave-title">Leave</p>
                        <p className="leave-date">{formatLeaveDate(latestLeave.leave_start_time)}</p>
                        <p className="leave-status">
                            {latestLeave.approved_by ? `Approved ` : 'Rejected Approval'}
                        </p>
                    </div>
                ) : (
                    <p className="no-leave-text">No Leave Records Found</p>
                )}
            </div>
        </>
    );
}
