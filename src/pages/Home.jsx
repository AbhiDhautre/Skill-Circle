import React from "react";
import "../styles/home.css";


export default function Home() {
    console.log("Home page loaded");
  return (
    
    <div className="home-page">
    
      <section className="hero">
        <div className="hero-left">
          <h1>
            SKILL CIRCLE
            <br />
            <span className="highlight">A Peer-to-Peer Skill Exchange</span>
          </h1>
          <p>
            Skill Circle is a platform for college students to share skills,
            exchange learning, and grow together through peer-to-peer learning.
          </p>

          <div className="hero-buttons">
            <a href="/signup" className="btn btn-primary">
              Get Started
            </a>
            <a href="/courses" className="btn btn-outline">
              Browse Courses
            </a>
          </div>
        </div>

        
      </section>

      
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Create Your Profile</h3>
            <p>
              List your skills and interests. Tell others what you can teach or
              what you want to learn.
            </p>
          </div>
          <div className="step-card">
            <h3>2. Connect with Peers</h3>
            <p>
              Find classmates who share your interests or can help you grow new
              skills.
            </p>
          </div>
          <div className="step-card">
            <h3>3. Learn and Grow</h3>
            <p>
              Start sessions, complete challenges, and track your progress on
              the dashboard.
            </p>
          </div>
        </div>
      </section>

     
      <section className="top-skills">
        <h2 className="section-title">Popular Skills</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <h4>React Development</h4>
            <p>Build powerful web interfaces with React.js.</p>
          </div>
          <div className="skill-card">
            <h4>Data Structures</h4>
            <p>Master algorithmic thinking and problem solving.</p>
          </div>
          <div className="skill-card">
            <h4>Graphic Design</h4>
            <p>Create stunning visuals using Figma and Photoshop.</p>
          </div>
          <div className="skill-card">
            <h4>Machine Learning</h4>
            <p>Understand models and AI through Python projects.</p>
          </div>
        </div>
      </section>
     
    </div>
 
  );
}
