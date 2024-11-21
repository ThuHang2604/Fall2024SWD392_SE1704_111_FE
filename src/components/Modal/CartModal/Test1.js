import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingCalendar = ({ selectedDate, onDateChange, onTimeSelect }) => {
  const times = [
    '10:00 am',
    '10:30 am',
    '11:00 am',
    '11:30 am',
    '12:00 pm',
    '12:30 pm',
    '1:00 pm',
    '1:30 pm',
    '2:00 pm',
    '2:30 pm',
    '3:00 pm',
    '3:30 pm',
    '4:00 pm',
    '4:30 pm',
    '5:00 pm',
  ];

  return (
    <div className="booking-calendar">
      <h3>Select a Date and Time</h3>
      <Calendar onChange={onDateChange} value={selectedDate} />
      <div className="time-slots">
        <h4>{selectedDate.toDateString()}</h4>
        <div className="time-grid">
          {times.map((time, index) => (
            <button key={index} className="time-slot" onClick={() => onTimeSelect(time)}>
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
