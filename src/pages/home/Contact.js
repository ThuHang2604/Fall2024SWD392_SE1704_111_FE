import React from 'react';
import './index.scss';
import Hair from './img/hair.jpg';

const Contact = () => {
  return (
    <div className="contact-section">
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>North Spokane:</p>
          <p>3913 N Market Street, Spokane, WA 99207, USA</p>
          <p>curleyqsnorth@gmail.com</p>
          <p>North (509)435-7665</p>
          <div className="contact-icons">
            <span>📍</span>
            <span>📘</span>
          </div>
        </div>
        <div className="contact-image">
          <img src={Hair} alt="Hair Wash" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
