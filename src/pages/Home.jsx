import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {
  return (
    <div className="home-page">

    
      <section className="hero">
        <div className="hero-left">
          <h1>
            SKILL CIRCLE <br />
            <span className="highlight">
              A Peer-to-Peer Skill Exchange
            </span>
          </h1>

          <p>
            Learn faster by teaching others and discovering skills from your peers.
            Build your network, grow together, and level up your knowledge.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>

            <Link to="/courses" className="btn btn-outline">
              Browse Courses
            </Link>
          </div>

         
          <div className="stats">
            <div>
              <h3>120+</h3>
              <p>Active Learners</p>
            </div>
            <div>
              <h3>80+</h3>
              <p>Skills Shared</p>
            </div>
            <div>
              <h3>300+</h3>
              <p>Sessions Done</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-logo-shell">
            <img src={logo} alt="Skill Circle logo" className="hero-logo-image" />
          </div>
        </div>
      </section>


      <section className="section">
        <h2 className="section-title">How It Works</h2>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Create Profile</h3>
            <p>
              Add your skills and interests so others can connect with you.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h3>Connect</h3>
            <p>
              Find peers who match your learning goals or can teach you.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Grow</h3>
            <p>
              Learn together, complete challenges, and improve continuously.
            </p>
          </div>
        </div>
      </section>


      {/* POPULAR SKILLS */}
      <section className="section">
        <h2 className="section-title">Popular Skills</h2>

        <div className="skills-grid">
          <div className="skill-card">
            <h4>⚛️ React Development</h4>
            <p>Build modern UI applications with React.</p>
          </div>

          <div className="skill-card">
            <h4>🧠 Data Structures</h4>
            <p>Improve logic and problem-solving skills.</p>
          </div>

          <div className="skill-card">
            <h4>🎨 Graphic Design</h4>
            <p>Create stunning visuals using Figma.</p>
          </div>

          <div className="skill-card">
            <h4>🤖 Machine Learning</h4>
            <p>Explore AI models and real-world applications.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
