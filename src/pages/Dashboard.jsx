import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import "../styles/dashboard.css";
import { auth } from "../firebase";
import { subscribeToUser, acceptConnectionRequest, declineConnectionRequest } from "../utils/appState";
import { toast } from "react-toastify";
import ChatWidget from "../components/ChatWidget";

/* ---- 3D Tilt Wrapper for Dashboard Cards ---- */
function DashTiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);

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

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotationX: 10 }}
      animate={inView ? { opacity: 1, y: 0, rotationX: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/* Animated XP bar */
function XpBar({ xp, level }) {
  const xpInLevel = xp % 250;
  const xpPercent = (xpInLevel / 250) * 100;
  return (
    <div className="xp-bar-wrapper">
      <div className="xp-label-row">
        <span className="xp-label">XP Sync Status</span>
        <span className="xp-value">{xp} XP</span>
      </div>
      <div className="xp-bar">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${xpPercent}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState({ name: "", primarySkill: "" });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [connections, setConnections] = useState([]);
  const [xp, setXp] = useState(1250);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeChatPeer, setActiveChatPeer] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToUser(({ profile, enrollments, connections, xp, incomingRequests }) => {
      setProfile(profile);
      setEnrolledCourses(enrollments);
      setConnections(connections);
      setXp(xp);
      setIncomingRequests(incomingRequests || []);
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async (request) => {
    await acceptConnectionRequest(request);
    toast.success(`Node linked with ${request.fromName}! 🎉`);
  };

  const handleDecline = async (request) => {
    await declineConnectionRequest(request);
    toast.info(`Link request from ${request.fromName} ignored.`);
  };

  const authName = auth.currentUser?.displayName;
  const emailName = auth.currentUser?.email?.split("@")[0];
  const level = Math.max(1, Math.floor(xp / 250) + 1);

  const user = {
    name: authName || profile?.name || emailName || "Anonymous Node",
    avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    skills: profile?.primarySkill ? [profile.primarySkill, "Python", "UI/UX"] : ["React", "Python", "UI/UX"],
    xp,
    level,
    badges: [
      { name: "Skill Mentor", icon: "🏅" },
      { name: "Fast Learner", icon: "⚡" },
      { name: "Top Collaborator", icon: "🤝" },
    ],
  };

  const recentActivity = [
    `${connections.length} peer link${connections.length === 1 ? "" : "s"} established`,
    `${enrolledCourses.length} knowledge stream${enrolledCourses.length === 1 ? "" : "s"} active`,
    `${enrolledCourses.filter((c) => c.progress >= 100).length} stream${enrolledCourses.filter((c) => c.progress >= 100).length === 1 ? "" : "s"} fully synchronized`,
  ];

  return (
    <div className="dashboard-page">

      {incomingRequests.length > 0 && (
        <FadeUp>
          <section className="requests-section holo-card">
            <h2 className="section-title">
              🔔 Link Requests
              <span className="request-badge">{incomingRequests.length}</span>
            </h2>
            <div className="requests-list">
              {incomingRequests.map((req, i) => (
                <DashTiltCard key={i} className="request-card">
                  <div className="request-info">
                    <img
                      src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"
                      alt="avatar"
                      className="request-avatar"
                    />
                    <div>
                      <p className="request-name">{req.fromName}</p>
                      <p className="request-skill">Vector: {req.fromSkill}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn-accept" onClick={() => handleAccept(req)}>✓ Link Node</button>
                    <button className="btn-decline" onClick={() => handleDecline(req)}>✕ Ignore</button>
                  </div>
                </DashTiltCard>
              ))}
            </div>
          </section>
        </FadeUp>
      )}

      {/* Profile Card */}
      <FadeUp delay={0.05}>
        <DashTiltCard className="profile-card holo-card">
          <img src={user.avatar} alt="User" className="avatar" />
          <div className="profile-info">
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
              <h2>{user.name}</h2>
              <span className="level-badge">⚡ Tier {user.level}</span>
            </div>
            <p className="muted">{user.xp} XP Synchronized</p>
            <div className="skills" style={{ marginBottom: 20 }}>
              {user.skills.map((s, i) => (
                <span key={i} className="tag">{s}</span>
              ))}
            </div>
            <XpBar xp={user.xp} level={user.level} />
          </div>
        </DashTiltCard>
      </FadeUp>

      {/* Stats Grid */}
      <FadeUp delay={0.1}>
        <section className="stats-grid">
          {[
            { label: "Streams Synchronized", val: enrolledCourses.filter((c) => c.progress >= 100).length },
            { label: "Active Peer Links", val: connections.length },
            { label: "Total Network XP", val: user.xp },
          ].map((s, i) => (
            <DashTiltCard key={s.label} className="stat-card holo-card">
              <h3>{s.label}</h3>
              <motion.p
                className="stat-num"
                initial={{ opacity: 0, scale: 0.8, z: -20 }}
                animate={{ opacity: 1, scale: 1, z: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {s.val}
              </motion.p>
            </DashTiltCard>
          ))}
        </section>
      </FadeUp>

      {/* Badges */}
      <FadeUp delay={0.15}>
        <section className="badges-section">
          <h2 className="section-title">Ecosystem Achievements</h2>
          <div className="badges-grid">
            {user.badges.map((b, i) => (
              <DashTiltCard key={i} className="badge-card holo-card">
                <span className="badge-icon">{b.icon}</span>
                <p>{b.name}</p>
              </DashTiltCard>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* Active Network Links */}
      {connections.length > 0 && (
        <FadeUp delay={0.18}>
          <section className="requests-section holo-card" style={{ marginTop: "32px", padding: "24px" }}>
            <h2 className="section-title">Active Network Links</h2>
            <div className="requests-list">
              {connections.map((conn, i) => (
                <DashTiltCard key={i} className="request-card">
                  <div className="request-info">
                    <img
                      src={conn.avatar || "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"}
                      alt="avatar"
                      className="request-avatar"
                    />
                    <div>
                      <p className="request-name">{conn.name}</p>
                      <p className="request-skill">Vector: {conn.skill || "General"}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="btn-accept" 
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--purple))", boxShadow: "0 4px 12px rgba(124,58,237,0.2)" }}
                      onClick={() => setActiveChatPeer(conn)}
                    >
                      💬 Message
                    </button>
                  </div>
                </DashTiltCard>
              ))}
            </div>
          </section>
        </FadeUp>
      )}

      {/* Activity */}
      <FadeUp delay={0.2}>
        <section className="activity-section">
          <h2 className="section-title">Terminal Output</h2>
          <ul className="activity-list">
            {recentActivity.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {`> ${a}`}
              </motion.li>
            ))}
          </ul>
        </section>
      </FadeUp>

      {/* Chat Widget Overlay */}
      <ChatWidget peer={activeChatPeer} onClose={() => setActiveChatPeer(null)} />
    </div>
  );
}
