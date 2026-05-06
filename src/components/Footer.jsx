import React from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Gradient top border */}
      <div className="footer-gradient-border" />

      {/* Main content */}
      <div className="container footer-content">

        <div className="footer-col footer-brand">
          <h2>Skill Circle</h2>
          <p>
            A vibrant peer-to-peer learning community. Share skills, level up together, and build your network.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/" aria-label="Instagram" className="social-icon">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn" className="social-icon">
              <i className="fab fa-linkedin" />
            </a>
            <a href="https://github.com/AbhiDhautre/Skill-Circle.git" aria-label="GitHub" className="social-icon">
              <i className="fab fa-github" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Platform</h3>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/findskills">Find Skills</Link></li>
            <li><Link to="/gamification">Gamification</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Skill Circle • Built by Peers, For Peers</p>
      </div>
    </footer>
  );
}
