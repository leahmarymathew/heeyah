import React, { useState } from 'react';
import './Calendar.css';

const SimpleCalendar = ({ selectedDate, onChange, onClose }) => {
    // --- 1. Internal state to track the current selection ---
    // This allows the user to click around without affecting the parent state.
    const [currentSelection, setCurrentSelection] = useState(selectedDate || new Date());
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

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
    // Add empty divs for days before the 1st of the month
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    // Add the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        // --- 2. Styling is now based on the internal 'currentSelection' state ---
        const isSelected = currentSelection && date.toDateString() === currentSelection.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();

        let dayClassName = "calendar-day";
        if (isSelected) dayClassName += " selected";
        if (isToday) dayClassName += " today";

        calendarDays.push(
            // --- 3. Clicking a day only updates the internal state ---
            <div key={day} className={dayClassName} onClick={() => setCurrentSelection(date)}>
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

    // --- 4. Handler for the "Done" button ---
    // This function calls the parent's onChange with the chosen date.
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

            {/* --- 5. Footer with "Cancel" and "Done" buttons --- */}
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
