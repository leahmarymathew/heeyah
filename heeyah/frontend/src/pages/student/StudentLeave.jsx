import React, { useState } from 'react';
import './studentLeave.css';
import Navbar from "../../components/Navbar";
import SimpleCalendar from '../../components/Calendar'; 

const StudentLeave = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarTarget, setCalendarTarget] = useState(null); 

    const formatDateForDisplay = (date) => {
        if (!date) return "Select Date";
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
            // --- NEW LOGIC ---
            // If new start date is after the end date, clear the end date
            if (endDate && newDate > endDate) {
                setEndDate(null);
            }
        } else if (calendarTarget === 'end') {
            setEndDate(newDate);
        }
        handleCloseCalendar();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Leave Request:", {
            startDate, endDate, startTime, endTime, purpose
        });
        alert("Leave request submitted!");
    };

    const getCalendarDate = () => {
        if (calendarTarget === 'start' && startDate) return startDate;
        if (calendarTarget === 'end' && endDate) return endDate;
        return new Date();
    };

    // --- NEW LOGIC: Determine the minimum date for the calendar ---
    const getMinDateForCalendar = () => {
        // For 'End Date', the min date is the 'Start Date' (or today if 'Start Date' isn't set)
        if (calendarTarget === 'end') {
            return startDate || new Date(); 
        }
        // For 'Start Date', the min date is always today
        return new Date();
    };

    return (
        <>
            <Navbar />
            <div className="main">
                <div className="leave-form-container">
                    <form className="leave-form" onSubmit={handleSubmit}>
                        <h2>Leave Form</h2>
                        
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
                        
                        <button type="submit" className="submit-button">
                            Submit Leave
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
                            // --- PASS THE NEW PROP HERE ---
                            minDate={getMinDateForCalendar()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default StudentLeave;

