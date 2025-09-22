import React, { useState } from 'react';
import './Calendar.css';

const SimpleCalendar = ({ selectedDate, onChange }) => {
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
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();

        let dayClassName = "calendar-day";
        if (isSelected) dayClassName += " selected";
        if (isToday) dayClassName += " today";

        calendarDays.push(
            <div key={day} className={dayClassName} onClick={() => onChange(date)}>
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
        </div>
    );
};

export default SimpleCalendar;