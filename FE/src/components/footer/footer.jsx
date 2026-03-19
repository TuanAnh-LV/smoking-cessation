import React from 'react';
import './footer.scss';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import LogQuitSmokingLogo from '../../assets/LogQuitSmoking.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-section">
          <h4>Introduce</h4>
          <ul>
            <li><a href="#">About the platform</a></li>
            <li><a href="#">Service packages</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Quit Smoking Plan</a></li>
            <li><a href="#">Badges</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>About Us</h4>
          <ul>
            <li><a href="#">Information</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>
        <div className="footer-brand">
          <img src={LogQuitSmokingLogo} alt="Quit Smoking Logo" className="logo" />
          <h3>Quit smoking for a better life</h3>
          <p>Contact with us</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaXTwitter /></a>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="copyright">
        &copy; 2025 Quit Smoking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
