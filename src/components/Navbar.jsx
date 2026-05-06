import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import "../styles/navbar.css";
import { AuthContext } from "../App";
import { auth } from "../firebase";
import logo from "../assets/logo.png";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    ["userName", "primarySkill", "skillCircleProfile", "isLoggedIn"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/courses", label: "Courses" },
    { to: "/community", label: "Community" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/gamification", label: "Gamification" },
    { to: "/findskills", label: "Find Skills" },
  ];

  return (
    <motion.nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Skill Circle" className="nav-logo-image" />
          <h2>Skill Circle</h2>
        </NavLink>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          role="button"
          aria-label="Toggle menu"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                {label}
              </NavLink>
            </li>
          ))}
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
              <li className="nav-item-special">
                <NotificationBell />
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </motion.nav>
  );
}
