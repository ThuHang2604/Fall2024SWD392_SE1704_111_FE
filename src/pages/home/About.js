import React from 'react';
import './index.scss';
import imgHi from './img/womanhi.jpg';

function About() {
  return (
    <div className="about-section">
      <div className="about-cover">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">ABOUT</h2>
            <h3 className="about-subtitle">GODDESS BRAIDS</h3>
            <div className="text-and-wave">
              <p>
                I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or
                double click me to add your own content and make changes to the font. I'm a great place for you to tell
                a story and let your users know a little more about you.
              </p>

              <div className="wavy-line"></div>
            </div>
            <button className="read-more">READ MORE</button>
          </div>

          <div className="about-image">
            <img src={imgHi} alt="About Woman" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
