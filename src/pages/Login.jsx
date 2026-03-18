import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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
    <div className="auth-page" style={{ textAlign: "center", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>Welcome Back 👋</h2>

      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Login
        </button>

      </form>
    </div>
  );
}