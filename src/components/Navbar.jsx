import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../App"; // ✅ Import context
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* ---------- Logo ---------- */}
        <div className="nav-logo">
          <img src={logo} alt="Skill Circle" className="nav-logo-image" />
          <div>
            <h2>Skill Circle</h2>
            <p className="tagline">A Peer-to-Peer Skill Exchange</p>
          </div>
        </div>

        {/* ---------- Hamburger Menu ---------- */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ---------- Navigation Links ---------- */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses">Courses</NavLink>
          </li>
          <li>
            <NavLink to="/community">Community</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/gamification">Gamification</NavLink>
          </li>
          <li>
            <NavLink to="/findskills">Find Skills</NavLink>
          </li>

          {/* ---------- Conditional Buttons ---------- */}
          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/login" className="login-link">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="signup-btn">
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
