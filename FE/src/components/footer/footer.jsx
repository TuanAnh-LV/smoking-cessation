import React from 'react';
import './footer.scss';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6'; // Using fa6 for consistency
import LogQuitSmokingLogo from '../../assets/LogQuitSmoking.png'; // Import the logo image

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
          {/* Replace with your logo */}
          {/* <img src="/path/to/logo.png" alt="Quit Smoking Logo" className="logo"/> */}
          {/* For now, just text placeholder */}
          <img src={LogQuitSmokingLogo} alt="Quit Smoking Logo" className="logo"/> {/* Use the imported logo */}

          <h3>Quit smoking for a better life</h3>
          <p>Contact with us</p>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaXTwitter /></a>
            {/* The image shows an X icon, which maps to FaXTwitter in react-icons/fa6 */}
            {/* Add Youtube if needed, but not in the image */}
            {/* <a href="#"><FaYoutube /></a> */}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="copyright">
        © 2025 Quite Smoking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;