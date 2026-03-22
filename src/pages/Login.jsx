import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/auth.css";

export default function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("🎉 Login Successful!");
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form smooth-form">
          <h2>Welcome Back</h2>
          <p className="subtitle">
            Pick up where you left off and continue learning with your circle.
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary full-width">
              Login
            </button>
          </form>
        </div>

        <div className="auth-gradient">
          <div className="icon-container">
            <span className="icon">☕</span>
            <h2>Return To Your Circle</h2>
            <p>Reconnect with peers, sessions, and progress that already have your momentum.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
