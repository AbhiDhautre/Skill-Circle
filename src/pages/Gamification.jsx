import React, { useEffect, useState } from "react";
import "../styles/gamification.css";
import { subscribeToUser, subscribeToAllUsers, defaultCourses } from "../utils/appState";
import { auth } from "../firebase";

export default function Gamification() {
  const [profile, setProfile] = useState({ name: "" });
  const [xp, setXp] = useState(1250);
  const [connections, setConnections] = useState([]);
  const [enrollments, setEnrollments] = useState(defaultCourses.slice(0, 3));
  const [allUsers, setAllUsers] = useState([]);

  // Real-time current user data
  useEffect(() => {
    const unsubscribe = subscribeToUser(({ profile, connections, enrollments, xp }) => {
      setProfile(profile);
      setXp(xp);
      setConnections(connections);
      setEnrollments(enrollments);
    });
    return () => unsubscribe();
  }, []);

  // Real-time all users for live leaderboard
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

  // Build real leaderboard from all Firestore users, sorted by XP
  const leaderboard = allUsers
    .map((u) => ({
      id: u.id,
      name: u.name,
      xp: u.xp,
      isYou: u.id === currentUid,
    }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10); // top 10

  return (
    <div className="gamification-page">
      <h1 className="page-title">Gamification & Rewards</h1>
      <p className="subtitle">Earn XP, climb levels, and unlock badges by learning and contributing to the Skill Circle community.</p>

      <section className="xp-section">
        <div className="xp-card">
          <p className="muted">Welcome back, {userName}</p>
          <h3>Level {level}</h3>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p>{xp} XP / {nextLevelXP} XP</p>
          <p className="streak">🔥 {streak}-Day Streak</p>
        </div>
      </section>

      <section className="badges-section">
        <h2 className="section-title">Your Badges</h2>
        <div className="badges-grid">
          {badges.map((b, i) => (
            <div key={i} className="badge-card">
              <span className="badge-icon">{b.icon}</span>
              <div>
                <h4>{b.name}</h4>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="leaderboard-section">
        <h2 className="section-title">Live Leaderboard</h2>
        <div className="leaderboard">
          {leaderboard.length > 0 ? leaderboard.map((u, i) => (
            <div key={u.id} className={`leader-card ${u.isYou ? "is-you" : ""}`}>
              <span className="rank">#{i + 1}</span>
              <p className="name">{u.name} {u.isYou ? "(You)" : ""}</p>
              <span className="xp">{u.xp} XP</span>
            </div>
          )) : (
            <p className="muted">Loading leaderboard...</p>
          )}
        </div>
      </section>
    </div>
  );
}
