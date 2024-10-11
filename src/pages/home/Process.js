import React from 'react';
import './index.scss';
import Hair from './img/hair.jpg';

const ProcessSection = () => {
  return (
    <div className="process-cover">
      <div className="process-section">
        <div className="process-item">
          <img src={Hair} alt="Styling" />
          <div className="process-text">
            <h3>Styling</h3>
            <p>
              We don’t want to boast, but our clients have told us time and again there’s no better place to get a
              high-quality Styling than our Hair Salon. Schedule an appointment or drop by whenever you’d like!
            </p>
          </div>
        </div>
        <div className="process-item">
          <img src={Hair} alt="Cutting" />
          <div className="process-text">
            <h3>Cutting</h3>
            <p>
              At Curley Q’s Too Salon, our Cutting service is a little different than you might find elsewhere. From the
              minute you come into our Hair Salon, you’ll know you’re in good hands. Sit back, relax and let us do the
              rest.
            </p>
          </div>
        </div>
        <div className="process-item">
          <img src={Hair} alt="Coloring" />
          <div className="process-text">
            <h3>Coloring</h3>
            <p>
              Our highly trained staff are here to tackle all of your needs with a high-quality Coloring that will leave
              you looking and feeling your best. This service can be combined with others for a truly unparalleled
              experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
