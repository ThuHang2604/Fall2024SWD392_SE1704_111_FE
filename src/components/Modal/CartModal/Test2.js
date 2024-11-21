import React from 'react';

const BookingDetails = ({ time, location, duration }) => {
  return (
    <div className="booking-details">
      <h3>Booking Details</h3>
      <p>
        <strong>Trim</strong>
      </p>
      <p>{duration} min</p>
      <p>{location}</p>
      <button className="next-btn">Next</button>
    </div>
  );
};

export default BookingDetails;
