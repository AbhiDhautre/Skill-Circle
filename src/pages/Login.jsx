import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AuthContext } from "../App";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { saveProfile } from "../utils/appState";
import { Link } from "react-router-dom";
import "../styles/auth.css";

/* ---- 3D Tilt Wrapper for Auth Card ---- */
function AuthTiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Login() {
  const { setIsLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [enrollmentNumber, setEnrollmentNumber] = React.useState("");
  const [password, setPassword] = React.useState("");

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

      toast.success("🎉 Authentication Successful");
      localStorage.setItem("isLoggedIn", "true");
      saveProfile({
        name: resolvedName,
        enrollmentNumber: enrollmentNumber.trim(),
        email: signedInUser.email || "",
        primarySkill: localStorage.getItem("primarySkill") || "React",
        bio: "Node integrated. Ready for knowledge transfer."
      });

      setIsLoggedIn(true);
      navigate(location.state?.from || "/dashboard");

    } catch (error) {
      toast.error("Authentication failed. " + error.message);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95, rotationX: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotationX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1500, width: "100%", display: "flex", justifyContent: "center" }}
      >
        <AuthTiltCard className="auth-card">
          {/* Form Side */}
          <div className="auth-form smooth-form">
            <h2>Welcome Back</h2>
            <p className="subtitle">
              Reinitialize your connection to the ecosystem.
            </p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Node ID (Enrollment)</label>
                <input
                  type="text"
                  placeholder="Enter your enrollment number"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Security Key</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-submit">
                Initialize Connection →
              </button>
            </form>

            <p className="switch-text">
              Unregistered node? <Link to="/signup">Create Identity</Link>
            </p>
          </div>

          {/* Visual Side */}
          <div className="auth-gradient">
            {/* We can use CSS particles via immersive.css */}
            <div className="particle-field">
              {Array(15).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    background: i % 2 === 0 ? "#6366f1" : "#22d3ee",
                    width: Math.random() * 6 + 2 + "px",
                    height: Math.random() * 6 + 2 + "px",
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                    "--duration": Math.random() * 10 + 10 + "s",
                    "--delay": -Math.random() * 10 + "s",
                    "--opacity": Math.random() * 0.5 + 0.2,
                    "--blur": Math.random() * 2 + "px",
                    "--tx1": Math.random() * 60 - 30 + "px",
                    "--ty1": Math.random() * -60 - 20 + "px",
                    "--tx2": Math.random() * -60 + 30 + "px",
                    "--ty2": Math.random() * 60 + 20 + "px",
                    "--tx3": Math.random() * 40 - 20 + "px",
                    "--ty3": Math.random() * -40 - 10 + "px",
                  }}
                />
              ))}
            </div>
            <div className="icon-container">
              <span className="icon">🌌</span>
              <h2>Enter The Network</h2>
              <p>Re-sync your progress, connect with peers, and resume your evolutionary journey.</p>
            </div>
          </div>
        </AuthTiltCard>
      </motion.div>
    </div>
  );
}
