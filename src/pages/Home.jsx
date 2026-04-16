import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SpotlightCard from "../components/SpotlightCard";
import RotatingText from "../components/RotatingText";
import ShinyText from "../components/reactbits/ShinyText";
import StarBorder from "../components/reactbits/StarBorder";

export default function Home() {
  return (
    <div className="home-page">

      <section className="hero">
        <div className="hero-left">
          <h1>
            <ShinyText text="SKILL CIRCLE" disabled={false} speed={3} /> <br />
            <RotatingText 
              phrases={[
                "A Peer-to-Peer Skill Exchange",
                "Learn Together, Grow Together",
                "Level Up Your Knowledge",
                "Build Your Tech Network"
              ]}
              interval={4000}
              highlightClass="highlight"
            />
          </h1>

          <p>
            Learn faster by teaching others and discovering skills from your peers.
            Build your network, grow together, and level up your knowledge.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" style={{textDecoration: "none"}}>
              <StarBorder as="div" color="#8b5cf6" speed="4s" style={{padding: "4px"}}>
                 <span className="btn btn-primary" style={{margin:0, border:"none"}}>Get Started</span>
              </StarBorder>
            </Link>

            <Link to="/courses" style={{textDecoration: "none"}}>
              <StarBorder as="div" color="#38bdf8" speed="5s" style={{padding: "4px"}}>
                <span className="btn btn-outline" style={{margin:0, border:"none"}}>Browse Courses</span>
              </StarBorder>
            </Link>
          </div>

          <div className="stats">
            <SpotlightCard>
              <h3>120+</h3>
              <p>Active Learners</p>
            </SpotlightCard>
            <SpotlightCard>
              <h3>80+</h3>
              <p>Skills Shared</p>
            </SpotlightCard>
            <SpotlightCard>
              <h3>300+</h3>
              <p>Sessions Done</p>
            </SpotlightCard>
          </div>
        </div>

        <div className="hero-visual">
          <SpotlightCard className="hero-logo-shell" spotlightColor="rgba(56, 189, 248, 0.2)">
            <img src={logo} alt="Skill Circle logo" className="hero-logo-image" />
          </SpotlightCard>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How It Works</h2>

        <div className="steps-grid">
          <SpotlightCard className="step-card">
            <span className="step-number">01</span>
            <h3>Create Profile</h3>
            <p>
              Add your skills and interests so others can connect with you.
            </p>
          </SpotlightCard>

          <SpotlightCard className="step-card">
            <span className="step-number">02</span>
            <h3>Connect</h3>
            <p>
              Find peers who match your learning goals or can teach you.
            </p>
          </SpotlightCard>

          <SpotlightCard className="step-card">
            <span className="step-number">03</span>
            <h3>Grow</h3>
            <p>
              Learn together, complete challenges, and improve continuously.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* SKILL DATASET FORM */}
      <section className="section">
        <h2 className="section-title">📋 Share Your Skills</h2>
        <p className="section-subtitle">Help us build a stronger community — fill in your skills and we'll match you with the right peers.</p>
        
        <div className="form-showcase-container">
          <div className="form-embed-wrapper">
            <div className="window-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <div className="window-title">Skill Circle Application Form</div>
            </div>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScORoErOcwqP9qUJgNUxmSuWx9l_TCmwKwjh3rmKJlc9l94Iw/viewform?embedded=true"
              width="100%"
              className="form-embed"
              title="Skill Circle Student Skills Form"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>

      {/* POPULAR SKILLS */}
      <section className="section">
        <h2 className="section-title">Popular Skills</h2>

        <div className="skills-grid">
          <SpotlightCard className="skill-card">
            <h4>⚛️ React Development</h4>
            <p>Build modern UI applications with React.</p>
          </SpotlightCard>

          <SpotlightCard className="skill-card">
            <h4>🧠 Data Structures</h4>
            <p>Improve logic and problem-solving skills.</p>
          </SpotlightCard>

          <SpotlightCard className="skill-card">
            <h4>🎨 Graphic Design</h4>
            <p>Create stunning visuals using Figma.</p>
          </SpotlightCard>

          <SpotlightCard className="skill-card">
            <h4>🤖 Machine Learning</h4>
            <p>Explore AI models and real-world applications.</p>
          </SpotlightCard>
        </div>
      </section>

    </div>
  );
}
