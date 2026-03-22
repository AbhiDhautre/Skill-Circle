import React from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Side */}
        <div className="footer-brand">
          <h2>Skill Circle</h2>
          </div>

        {/* Middle Links */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/community">Community</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/findskills">Find Skills</Link>
          <Link to="/gamification">Gamification</Link>
        </div>

        
        <div className="footer-socials">
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Skill Circle • All rights reserved</p>
      </div>
    </footer>
  );
}
