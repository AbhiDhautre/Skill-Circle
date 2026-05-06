import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "../styles/auth.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { saveProfile } from "../utils/appState";

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

export default function Signup() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = React.useContext(AuthContext);
  const [name, setName] = React.useState("");
  const [enrollmentNumber, setEnrollmentNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [skill, setSkill] = React.useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const dummyEmail = `${enrollmentNumber.trim()}@mitadt.edu`;
      const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      saveProfile({
        name: name.trim(),
        enrollmentNumber: enrollmentNumber.trim(),
        email: dummyEmail,
        primarySkill: skill.trim(),
        bio: `Initializing skill transfer protocols for ${skill.trim()}.`
      });

      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      toast.success("Identity Created. Welcome to the Network 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95, rotationX: -10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotationX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1500, width: "100%", display: "flex", justifyContent: "center" }}
      >
        <AuthTiltCard className="auth-card">
          {/* Form Side */}
          <div className="auth-form smooth-form">
            <h1>Create Identity</h1>
            <p className="subtitle">
              Join the ecosystem and initialize your peer-to-peer exchange node.
            </p>

            <form onSubmit={handleSignup}>
              <div className="input-group">
                <label>Full Designation</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Primary Skill Matrix</label>
                <input
                  type="text"
                  placeholder="e.g. React, UI/UX, Python"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-submit">
                Initialize Profile →
              </button>
            </form>

            <p className="switch-text">
              Already initialized? <Link to="/login">Connect here</Link>
            </p>
          </div>

          {/* Visual Side */}
          <div className="auth-gradient">
            <div className="particle-field">
              {Array(15).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    background: i % 2 === 0 ? "#8b5cf6" : "#22d3ee",
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
              <span className="icon">🚀</span>
              <h2>Expand The Galaxy</h2>
              <p>Add your skills to the collective and accelerate the learning curve of the entire network.</p>
            </div>
          </div>
        </AuthTiltCard>
      </motion.div>
    </div>
  );
}
