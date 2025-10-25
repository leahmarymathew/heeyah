import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from '../../supabase'; // your Supabase client
import './studentLeave.css';
import SimpleCalendar from '../../components/Calendar';

const API_BASE_URL = 'http://localhost:3001'; // backend URL

const StudentLeave = () => {
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
            if (endDate && newDate > endDate) setEndDate(null);
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

    const getMinDateForCalendar = () => {
        if (calendarTarget === 'end') return startDate || new Date();
        return new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!startDate || !endDate || !startTime || !endTime || !purpose) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            // 1. Get current Supabase session token
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session?.access_token) {
                setError('Session expired. Please log in again.');
                setLoading(false);
                return;
            }

            const token = session.access_token;

            // 2. Prepare data
            const leaveData = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                startTime,
                endTime,
                purpose,
            };

            // 3. Axios POST request
            const res = await axios.post(`${API_BASE_URL}/api/leave/create`, leaveData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSuccess('Leave submitted successfully!');
            setStartDate(null);
            setEndDate(null);
            setStartTime('');
            setEndTime('');
            setPurpose('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Failed to submit leave.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="main">
                <div className="leave-form-container">
                    <form className="leave-form" onSubmit={handleSubmit}>
                        <h2>Leave Form</h2>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <div className="form-row">
                            <label>Leave Start Date:</label>
                            <button
                                type="button"
                                className={`date-select-button ${startDate ? 'is-set' : ''}`}
                                onClick={() => handleOpenCalendar('start')}
                            >
                                {formatDateForDisplay(startDate)}
                            </button>
                        </div>

                        <div className="form-row">
                            <label>Leave End Date:</label>
                            <button
                                type="button"
                                className={`date-select-button ${endDate ? 'is-set' : ''}`}
                                onClick={() => handleOpenCalendar('end')}
                            >
                                {formatDateForDisplay(endDate)}
                            </button>
                        </div>

                        <div className="form-row">
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label>Purpose of Leave:</label>
                            <textarea
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
