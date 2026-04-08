import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { saveProfile } from "../utils/appState";
import "../styles/auth.css";

export default function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const dummyEmail = `${enrollmentNumber.trim()}@mitadt.edu`;
      const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, password);
      const signedInUser = userCredential.user;

      const resolvedName =
        signedInUser.displayName ||
        localStorage.getItem("userName") ||
        signedInUser.email?.split("@")[0] ||
        "Skill Circle Learner";

      toast.success("🎉 Login Successful!");
      localStorage.setItem("isLoggedIn", "true");
      saveProfile({
        name: resolvedName,
        enrollmentNumber: enrollmentNumber.trim(),
        email: signedInUser.email || "",
        primarySkill: localStorage.getItem("primarySkill") || "React",
        bio: "Peer learner building skills one exchange at a time."
      });

      setIsLoggedIn(true);
      navigate(location.state?.from || "/dashboard");

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
              <label>Enrollment Number</label>
              <input
                type="text"
                placeholder="Enter your enrollment number"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
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
