import React, { useState } from "react";
import "../styles/findskills.css";
import { toast } from "react-toastify";


export default function FindSkills() {
  const [query, setQuery] = useState("");
const handleConnect = (name) => {
  toast.success(`Connection request sent to ${name}`);
};
  const users = [
    {
      name: "Aarav Nair",
      skill: "React JS",
      role: "Frontend Developer",
      lookingFor: "UI/UX Designer",
      avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    {
      name: "Nina Patel",
      skill: "Figma",
      role: "UI/UX Designer",
      lookingFor: "React Developer",
      avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    {
      name: "Rohit Mehta",
      skill: "Machine Learning",
      role: "Data Scientist",
      lookingFor: "Python Learner",
      avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    {
      name: "Aisha Sharma",
      skill: "Java",
      role: "Backend Developer",
      lookingFor: "Frontend Partner",
      avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    {
      name: "Deep Verma",
      skill: "Python",
      role: "AI Enthusiast",
      lookingFor: "Data Analyst",
      avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
  ];

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.skill.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase()) ||
      user.lookingFor.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="findskills-page">
      <h1 className="page-title">Find Skills & Connect</h1>
      <p className="subtitle">
        Search for peers who have the skills you want to learn — or who need the
        skills you have.
      </p>

      <div className="search-section">
        <input
          type="text"
          className="search-bar input-surface"
          placeholder="Search by skill, name, or role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="skills-grid">
        {filtered.length > 0 ? (
          filtered.map((user, i) => (
            <div key={i} className="skill-card">
              <div className="profile">
                <img src={user.avatar} alt="User" className="avatar" />
                <div>
                  <h3>{user.name}</h3>
                  <p className="role">{user.role}</p>
                </div>
              </div>
              <div className="info">
                <p>
                  <strong>Skill:</strong> {user.skill}
                </p>
                <p>
                  <strong>Looking for:</strong> {user.lookingFor}
                </p>
              </div>
              <button onClick={() => handleConnect(user.name)} className="connect-btn"> Connect</button>
            </div>
          ))
        ) : (
          <p className="no-results">No matching users found</p>
        )}
      </div>
       
    </div>
  );
}
