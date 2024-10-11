import React from 'react';
import './index.scss';
import Hair from './img/hair.jpg';
const StylistSection = () => {
  return (
    <div className="follow-section">
      <div className="header">
        <h2 className="follow-title">FOLLOW</h2>
        <div className="insta-info">
          <p className="insta-text">OUR INSTA</p>
          <div className="black-bar"></div>
          <p className="insta-handle">@goddess.braids</p>
        </div>
      </div>
      <div className="image-grid">
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>@wix: #wix, #website, #freewebsite, #websitetemplate, #wix.com</p>
        </div>
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>Text to display on hover</p>
        </div>
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>Text to display on hover</p>
        </div>
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>Text to display on hover</p>
        </div>
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>Text to display on hover</p>
        </div>
        <div className="image-item">
          <img src={Hair} alt="Insta Post" />
          <p>Text to display on hover</p>
        </div>
      </div>
      <button className="load-more">Load More</button>
    </div>
  );
};

export default StylistSection;
