import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { auth } from "../firebase";
import { subscribeToUser, acceptConnectionRequest, declineConnectionRequest } from "../utils/appState";
import { toast } from "react-toastify";
import SpotlightCard from "../components/SpotlightCard";

export default function Dashboard() {
  const [profile, setProfile] = useState({ name: "", primarySkill: "" });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [connections, setConnections] = useState([]);
  const [xp, setXp] = useState(1250);
  const [incomingRequests, setIncomingRequests] = useState([]);

  // Real-time user data listener — includes incoming connection requests
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
    toast.success(`You are now connected with ${request.fromName}! 🎉`);
  };

  const handleDecline = async (request) => {
    await declineConnectionRequest(request);
    toast.info(`Connection request from ${request.fromName} declined.`);
  };



  const authName = auth.currentUser?.displayName;
  const emailName = auth.currentUser?.email?.split("@")[0];
  const level = Math.max(1, Math.floor(xp / 250) + 1);

  const user = {
    name: authName || profile?.name || emailName || "Skill Circle Learner",
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
    `${connections.length} peer connection${connections.length === 1 ? "" : "s"} started`,
    `${enrolledCourses.length} enrolled course${enrolledCourses.length === 1 ? "" : "s"} in progress`,
    `${enrolledCourses.filter((c) => c.progress >= 100).length} course${enrolledCourses.filter((c) => c.progress >= 100).length === 1 ? "" : "s"} completed`,
  ];

  return (
    <div className="dashboard-page">

      {/* ── Real-time Connection Requests Banner ── */}
      {incomingRequests.length > 0 && (
        <section className="requests-section">
          <h2 className="section-title">
            🔔 Connection Requests
            <span className="request-badge">{incomingRequests.length}</span>
          </h2>
          <div className="requests-list">
            {incomingRequests.map((req, i) => (
              <SpotlightCard key={i} className="request-card" spotlightColor="rgba(56, 189, 248, 0.25)">
                <div className="request-info">
                  <img
                    src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"
                    alt="avatar"
                    className="request-avatar"
                  />
                  <div>
                    <p className="request-name">{req.fromName}</p>
                    <p className="request-skill">Skill: {req.fromSkill}</p>
                  </div>
                </div>
                <div className="request-actions">
                  <button className="btn-accept" onClick={() => handleAccept(req)}>✓ Accept</button>
                  <button className="btn-decline" onClick={() => handleDecline(req)}>✕ Decline</button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      <SpotlightCard className="profile-card">
        <img src={user.avatar} alt="User" className="avatar" />
        <div>
          <h2>{user.name}</h2>
          <p className="muted">Level {user.level} • {user.xp} XP</p>
          <div className="skills">
            {user.skills.map((s, i) => (
              <span key={i} className="tag">{s}</span>
            ))}
          </div>
        </div>
      </SpotlightCard>

      <section className="stats-grid">
        <SpotlightCard className="stat-card">
          <h3>Courses Completed</h3>
          <p className="stat-num">{enrolledCourses.filter((c) => c.progress >= 100).length}</p>
        </SpotlightCard>
        <SpotlightCard className="stat-card">
          <h3>Peer Connections</h3>
          <p className="stat-num">{connections.length}</p>
        </SpotlightCard>
        <SpotlightCard className="stat-card">
          <h3>Total XP</h3>
          <p className="stat-num">{user.xp}</p>
        </SpotlightCard>
      </section>



      <section className="badges-section">
        <h2 className="section-title">Achievements</h2>
        <div className="badges-grid">
          {user.badges.map((b, i) => (
            <SpotlightCard key={i} className="badge-card">
              <span className="badge-icon">{b.icon}</span>
              <p>{b.name}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="activity-section">
        <h2 className="section-title">Recent Activity</h2>
        <ul className="activity-list">
          {recentActivity.map((a, i) => (
            <li key={i}>• {a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
