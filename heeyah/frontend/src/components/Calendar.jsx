import React, { useState } from 'react';
import './Calendar.css';

// --- 1. minDate is still a prop ---
const SimpleCalendar = ({ selectedDate, onChange, onClose, minDate }) => {
    const [currentSelection, setCurrentSelection] = useState(selectedDate || new Date());
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    // --- 2. UPDATED LOGIC ---
    // If minDate is passed, create a date from it. If not, set it to null.
    const minSelectableDate = minDate ? new Date(minDate) : null;
    
    // Set time to midnight *only if* minSelectableDate is not null
    if (minSelectableDate) {
        minSelectableDate.setHours(0, 0, 0, 0);
    }

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isSelected = currentSelection && date.toDateString() === currentSelection.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();

        // --- 3. UPDATED LOGIC ---
        // A date is "past" *only if* minSelectableDate exists AND the date is before it.
        const isPastDate = minSelectableDate && (date < minSelectableDate);

        let dayClassName = "calendar-day";
        if (isSelected) dayClassName += " selected";
        if (isToday) dayClassName += " today";
        if (isPastDate) dayClassName += " past";

        calendarDays.push(
            <div 
                key={day} 
                className={dayClassName} 
                onClick={() => isPastDate ? null : setCurrentSelection(date)}
            >
                {day}
            </div>
        );
    }

    const handlePrevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleConfirmSelection = () => {
        onChange(currentSelection);
    };

    return (
        <div className="simple-calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{monthNames[month]} {year}</span>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-weekdays">
                {daysOfWeek.map((day, index) => (
                    <div key={`${day}-${index}`} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {calendarDays}
            </div>

            <div className="calendar-footer">
                <button className="calendar-button cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="calendar-button confirm" onClick={handleConfirmSelection}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default SimpleCalendar;

