import React from 'react';
import './index.scss';
import imgHome from './img/woman4.png';

import About from './About'; // Import About section

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Phần trang Home */}
      <div className="top-section">
        <div className="left-section">
          <h1 className="title">GODDESS BRAIDS SALON</h1>
          <div className="subtitle-block"></div>
          <div className="subtitle">WHERE HAIR DREAMS COME TRUE</div>
          <button className="book-button">BOOK ONLINE</button>
        </div>
        <div className="right-section">
          <img className="main-image" src={imgHome} alt="Hair Salon" />
        </div>
      </div>

      <div className="social-links">
        <a href="https://facebook.com" className="social-icon">
          Facebook
        </a>
        <a href="https://instagram.com" className="social-icon">
          Instagram
        </a>
        <a href="https://twitter.com" className="social-icon">
          Twitter
        </a>
      </div>

      <About />
    </div>
  );
}

export default HomePage;
