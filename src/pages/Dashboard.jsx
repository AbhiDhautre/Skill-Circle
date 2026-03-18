import React from "react";
import "../styles/dashboard.css";



export default function Dashboard() {
  const user = {
    name: "Abhishek Sharma",
    avatar:
      "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    skills: ["React", "Python", "UI/UX"],
    xp: 1250,
    level: 5,
    badges: [
      { name: "Skill Mentor", icon: "🏅" },
      { name: "Fast Learner", icon: "⚡" },
      { name: "Top Collaborator", icon: "🤝" },
    ],
  };

  const enrolledCourses = [
    { title: "React Frontend Development", progress: 75 },
    { title: "Machine Learning with Python", progress: 40 },
    { title: "UI/UX Design Essentials", progress: 100 },
  ];

  const recentActivity = [
    "Completed UI/UX Design Essentials ",
    "Joined React Frontend Development ",
    "Earned Fast Learner badge",
  ];

  return (
    <div className="dashboard-page">
     
      <section className="profile-card">
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
      </section>

     
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Courses Completed</h3>
          <p className="stat-num">12</p>
        </div>
        <div className="stat-card">
          <h3>Badges Earned</h3>
          <p className="stat-num">{user.badges.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total XP</h3>
          <p className="stat-num">{user.xp}</p>
        </div>
      </section>

   
      <section className="enrolled-section">
        <h2 className="section-title">Your Enrolled Courses</h2>
        <div className="enrolled-grid">
          {enrolledCourses.map((c, i) => (
            <div key={i} className="course-card">
              <h4>{c.title}</h4>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${c.progress}%` }}
                ></div>
              </div>
              <p className="muted">{c.progress}% completed</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="badges-section">
        <h2 className="section-title">Achievements</h2>
        <div className="badges-grid">
          {user.badges.map((b, i) => (
            <div key={i} className="badge-card">
              <span className="badge-icon">{b.icon}</span>
              <p>{b.name}</p>
            </div>
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
