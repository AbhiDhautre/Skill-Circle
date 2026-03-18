import React from "react";
import "../styles/footer.css";

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
          <a href="/">Home</a>
          <a href="/courses">Courses</a>
          <a href="/community">Community</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/findskills">Find Skills</a>
        </div>

        
        <div className="footer-socials">
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" aria-label="GitHub">
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
