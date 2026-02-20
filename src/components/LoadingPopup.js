import React from 'react';
import '../Css/Login.css';
import leaf from '../images/logo.png';

const LoadingPopup = () => (
  <div className="loading-popup">
    <div className="popup-content">
      <div className="display-2">
<img src={leaf} alt="Logo" className="logo-blink" />
      </div>
      <p className='text-dark fw-bold'>Loading...</p>
    </div>
  </div>
);

export default LoadingPopup;
