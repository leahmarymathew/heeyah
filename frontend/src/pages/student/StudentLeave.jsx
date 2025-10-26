import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './studentLeave.css';
import Navbar from "../../components/Navbar";
import SimpleCalendar from '../../components/Calendar';

const API_BASE_URL = 'http://localhost:3001'; // backend URL

const StudentLeave = () => {
    const { user } = useContext(AuthContext);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarTarget, setCalendarTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const formatDateForDisplay = (date) => {
        if (!date) return 'Select Date';
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleOpenCalendar = (target) => {
        setCalendarTarget(target);
        setIsCalendarOpen(true);
    };

    const handleCloseCalendar = () => {
        setIsCalendarOpen(false);
        setCalendarTarget(null);
    };

    const handleDateSelect = (newDate) => {
        if (calendarTarget === 'start') {
            setStartDate(newDate);
            // If new start date is after the end date, clear the end date
            if (endDate && newDate > endDate) {
                setEndDate(null);
            }
        } else if (calendarTarget === 'end') {
            setEndDate(newDate);
        }
        handleCloseCalendar();
    };

    const getCalendarDate = () => {
        if (calendarTarget === 'start' && startDate) return startDate;
        if (calendarTarget === 'end' && endDate) return endDate;
        return new Date();
    };

    // Determine the minimum date for the calendar
    const getMinDateForCalendar = () => {
        // For 'End Date', the min date is the 'Start Date' (or today if 'Start Date' isn't set)
        if (calendarTarget === 'end') {
            return startDate || new Date();
        }
        // For 'Start Date', the min date is always today
        return new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Check if user is logged in
        if (!user || !user.roll_no) {
            setError('You must be logged in as a student to submit leave.');
            setLoading(false);
            return;
        }

        if (!startDate || !endDate || !startTime || !endTime || !purpose) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            // Prepare data with user information
            const leaveData = {
                rollNo: user.roll_no,
                studentName: user.name,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                startTime,
                endTime,
                purpose,
            };

            console.log('Submitting leave for:', user.name, 'Roll No:', user.roll_no);

            // Use simple leave endpoint
            const res = await axios.post(`${API_BASE_URL}/api/leave/simple`, leaveData);

            if (res.status === 201) {
                setSuccess(`Leave submitted successfully for ${user.name} (${user.roll_no})!`);
                // Reset form
                setStartDate(null);
                setEndDate(null);
                setStartTime('');
                setEndTime('');
                setPurpose('');
                setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
            }
        } catch (err) {
            console.error('Leave submission error:', err);
            setError(err.response?.data?.error || 'Failed to submit leave.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="main">
                <div className="leave-form-container">
                    <form className="leave-form" onSubmit={handleSubmit}>
                        <h2>Leave Form</h2>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <div className="form-row">
                            <label htmlFor="start-date">Leave Start Date:</label>
                            <button
                                type="button"
                                className={`date-select-button ${startDate ? 'is-set' : ''}`}
                                onClick={() => handleOpenCalendar('start')}
                            >
                                {formatDateForDisplay(startDate)}
                            </button>
                        </div>

                        <div className="form-row">
                            <label htmlFor="end-date">Leave End Date:</label>
                            <button
                                type="button"
                                className={`date-select-button ${endDate ? 'is-set' : ''}`}
                                onClick={() => handleOpenCalendar('end')}
                            >
                                {formatDateForDisplay(endDate)}
                            </button>
                        </div>

                        <div className="form-row">
                            <label htmlFor="start-time">Start Time:</label>
                            <input
                                id="start-time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="end-time">End Time:</label>
                            <input
                                id="end-time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="purpose">Purpose of Leave:</label>
                            <textarea
                                id="purpose"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="e.g., Family function, medical appointment"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Leave'}
                        </button>
                    </form>
                </div>
            </div>

            {isCalendarOpen && (
                <div className="calendar-modal-backdrop" onClick={handleCloseCalendar}>
                    <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                        <SimpleCalendar
                            selectedDate={getCalendarDate()}
                            onChange={handleDateSelect}
                            onClose={handleCloseCalendar}
                            minDate={getMinDateForCalendar()}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentLeave;
