import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../styles/navbar.css";
import { AuthContext } from "../App";
import { auth } from "../firebase";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userName");
    localStorage.removeItem("primarySkill");
    localStorage.removeItem("skillCircleProfile");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Skill Circle" className="nav-logo-image" />
          <div>
            <h2>Skill Circle</h2>
            <p className="tagline">A Peer-to-Peer Skill Exchange</p>
          </div>
        </NavLink>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
          </li>
          <li>
            <NavLink to="/community" onClick={() => setMenuOpen(false)}>Community</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/gamification" onClick={() => setMenuOpen(false)}>Gamification</NavLink>
          </li>
          <li>
            <NavLink to="/findskills" onClick={() => setMenuOpen(false)}>Find Skills</NavLink>
          </li>

          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/login" className="login-link" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="signup-btn" onClick={() => setMenuOpen(false)}>
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
