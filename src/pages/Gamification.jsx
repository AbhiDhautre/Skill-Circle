import React, { useEffect, useState } from "react";
import "../styles/gamification.css";
import { subscribeToUser, subscribeToAllUsers, defaultCourses } from "../utils/appState";
import { auth } from "../firebase";
import SpotlightCard from "../components/SpotlightCard";

export default function Gamification() {
  const [profile, setProfile] = useState({ name: "" });
  const [xp, setXp] = useState(1250);
  const [connections, setConnections] = useState([]);
  const [enrollments, setEnrollments] = useState(defaultCourses.slice(0, 3));
  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    const unsubscribe = subscribeToUser(({ profile, connections, enrollments, xp }) => {
      setProfile(profile);
      setXp(xp);
      setConnections(connections);
      setEnrollments(enrollments);
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((users) => {
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, []);

  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const nextLevelXP = level * 250;
  const streak = Math.min(30, 5 + connections.length);
  const completedCourses = enrollments.filter((course) => course.progress >= 100).length;
  const currentLevelBase = (level - 1) * 250;
  const progressPercent = Math.min(100, ((xp - currentLevelBase) / 250) * 100);

  const currentUid = auth.currentUser?.uid;
  const userName = profile?.name || "Skill Circle Learner";

  const badges = [
    { name: "Skill Mentor", icon: "🏅", desc: "Shared your first learning milestone" },
    { name: "Fast Learner", icon: "⚡", desc: `${completedCourses} completed course${completedCourses !== 1 ? "s" : ""}` },
    { name: "Collaborator", icon: "🤝", desc: `${connections.length} peer connection${connections.length !== 1 ? "s" : ""} started` },
    { name: "Consistency", icon: "🔥", desc: `${streak}-day engagement streak` },
  ];

  
  const leaderboard = allUsers
    .map((u) => ({
      id: u.id,
      name: u.name,
      xp: u.xp,
      isYou: u.id === currentUid,
    }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10); 

  return (
    <div className="gamification-page">
      <h1 className="page-title">Gamification & Rewards</h1>
      <p className="subtitle">Earn XP, climb levels, and unlock badges by learning and contributing to the Skill Circle community.</p>

      <section className="xp-section">
        <SpotlightCard className="xp-card">
          <p className="muted">Welcome back, {userName}</p>
          <h3>Level {level}</h3>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p>{xp} XP / {nextLevelXP} XP</p>
          <p className="streak">🔥 {streak}-Day Streak</p>
        </SpotlightCard>
      </section>

      <section className="badges-section">
        <h2 className="section-title">Your Badges</h2>
        <div className="badges-grid">
          {badges.map((b, i) => (
            <SpotlightCard key={i} className="badge-card">
              <span className="badge-icon">{b.icon}</span>
              <div>
                <h4>{b.name}</h4>
                <p>{b.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="leaderboard-section">
        <h2 className="section-title">Live Leaderboard</h2>
        <div className="leaderboard">
          {leaderboard.length > 0 ? leaderboard.map((u, i) => (
            <SpotlightCard key={u.id} className={`leader-card ${u.isYou ? "is-you" : ""}`} spotlightColor={u.isYou ? "rgba(244, 63, 94, 0.3)" : "rgba(139, 92, 246, 0.25)"}>
              <span className="rank">#{i + 1}</span>
              <p className="name">{u.name} {u.isYou ? "(You)" : ""}</p>
              <span className="xp">{u.xp} XP</span>
            </SpotlightCard>
          )) : (
            <p className="muted">Loading leaderboard...</p>
          )}
        </div>
      </section>
    </div>
  );
}
