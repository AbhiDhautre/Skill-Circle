import React from "react";
import "../styles/gamification.css";



export default function Gamification() {
  const user = {
    name: "Aisha Sharma",
    xp: 1250,
    nextLevelXP: 2000,
    level: 5,
    streak: 12,
  };

  const badges = [
    { name: "Skill Mentor", icon: "🏅", desc: "Taught 5 sessions" },
    { name: "Fast Learner", icon: "⚡", desc: "Completed 10 courses" },
    { name: "Collaborator", icon: "🤝", desc: "Helped 3 peers" },
    { name: "Consistency King", icon: "🔥", desc: "7-day learning streak" },
  ];

  const leaderboard = [
    { name: "Rohit Mehta", xp: 2200 },
    { name: "Aisha Sharma", xp: 1250 },
    { name: "Nina Patel", xp: 1030 },
  ];

  const progressPercent = (user.xp / user.nextLevelXP) * 100;

  return (
    <div className="gamification-page">
      <h1 className="page-title">Gamification & Rewards</h1>
      <p className="subtitle">
        Earn XP, climb levels, and unlock badges by learning and contributing to
        the Skill Circle community.
      </p>

    
      <section className="xp-section">
        <div className="xp-card">
          <h3>Level {user.level}</h3>
          <div className="xp-bar">
            <div
              className="xp-progress"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p>
            {user.xp} XP / {user.nextLevelXP} XP
          </p>
          <p className="streak"> {user.streak}-Day Streak</p>
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
        <h2 className="section-title">Leaderboard</h2>
        <div className="leaderboard">
          {leaderboard.map((u, i) => (
            <div key={i} className="leader-card">
              <span className="rank">#{i + 1}</span>
              <p className="name">{u.name}</p>
              <span className="xp">{u.xp} XP</span>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
