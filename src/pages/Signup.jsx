import React, { useContext, useState } from "react";
import "../styles/auth.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function Signup() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skill, setSkill] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault(); // prevents page reload

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      localStorage.setItem("userName", name.trim());
      localStorage.setItem("primarySkill", skill.trim());
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        <div className="auth-form smooth-form">
          <h1>Create Account</h1>
          <p className="subtitle">
            Join Skill Circle and start learning with your peers.
          </p>

          <form onSubmit={handleSignup}>
            
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="input-group">
              <label>Primary Skill</label>
              <input
                type="text"
                placeholder="e.g. React, Figma, Java"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary full-width">
              Sign Up
            </button>
          </form>

          <p className="switch-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>

        <div className="auth-gradient">
          <div className="icon-container">
            <span className="icon">📈</span>
            <h2>Join & Grow</h2>
            <p>Start your learning journey and connect with peers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
