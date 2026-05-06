import React, { useRef, useEffect } from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCanvas from "../components/HeroCanvas";
import MagneticButton from "../components/MagneticButton";
import { subscribeToStats } from "../utils/appState";

gsap.registerPlugin(ScrollTrigger);

/* ---- Scroll-reveal wrapper with Framer Motion ---- */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---- Skills ---- */
const SKILLS = [
  { icon: "⚛️", title: "React Development", desc: "Build modern UI applications with React and the latest ecosystem tools." },
  { icon: "🧠", title: "Data Structures", desc: "Improve logic and problem-solving skills with algorithms." },
  { icon: "🎨", title: "Graphic Design", desc: "Create stunning visuals and interfaces using Figma and design thinking." },
  { icon: "🤖", title: "Machine Learning", desc: "Explore AI models and real-world ML applications with peers." },
];

export default function Home() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const stepsContainerRef = useRef(null);
  const formSectionRef = useRef(null);

  // Real-time Stats State
  const [stats, setStats] = React.useState({
    activeLearners: 0,
    skillsShared: 0,
    sessionsDone: 0
  });

  // Subscribe to global stats
  useEffect(() => {
    const unsub = subscribeToStats((newStats) => {
      setStats(newStats);
    });
    return () => unsub();
  }, []);

  // Track mouse for 3D canvas
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Scroll Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Step Cards with staggered batch
      const stepCards = gsap.utils.toArray(".step-card");
      if (stepCards.length) {
        gsap.set(stepCards, { y: 80, opacity: 0, scale: 0.92 });

        ScrollTrigger.batch(stepCards, {
          start: "top 90%",
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
              overwrite: true,
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              y: 80,
              opacity: 0,
              scale: 0.92,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.in",
              overwrite: true,
            });
          },
        });
      }

      // 2. Form section depth scale
      if (formSectionRef.current) {
        gsap.fromTo(
          ".form-embed-wrapper",
          { scale: 0.8, opacity: 0, rotationX: 10 },
          {
            scale: 1,
            opacity: 1,
            rotationX: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: formSectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      }
    }); // removed containerRef scope to be safe

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-page" ref={containerRef}>
      {/* ====================================================
          HERO — 3D IMMERSIVE
         ==================================================== */}
      <section className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="hero-eyebrow-dot" />
            Peer-to-Peer Skill Exchange
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-heading-word">Learn.</span>
            <span className="hero-heading-word">Build.</span>
            <span className="hero-heading-word gradient">Connect.</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A next-generation collaborative learning ecosystem powered by interaction, creativity, and shared growth.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <MagneticButton strength={0.2}>
              <Link to="/dashboard" className="hero-btn-primary">
                Get Started <span className="btn-arrow">→</span>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Link to="/courses" className="hero-btn-secondary">
                Browse Courses
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { num: `${stats.activeLearners}+`, label: "Active Learners" },
              { num: `${stats.skillsShared}+`, label: "Skills Shared" },
              { num: `${stats.sessionsDone}+`, label: "Sessions Done" },
            ].map((stat, i) => (
              <FadeUp key={i} delay={0.4 + i * 0.1}>
                <div className="stat-item">
                  <span className="stat-num">{stat.num}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </FadeUp>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — R3F Canvas */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <HeroCanvas mouseRef={mouseRef} />
        </motion.div>
      </section>

      {/* ====================================================
          HOW IT WORKS (Pinned GSAP Section)
         ==================================================== */}
      <section className="how-section" ref={stepsContainerRef}>
        <div className="how-header">
          <div className="section-eyebrow">
            <span className="section-eyebrow-dot" /> How It Works
          </div>
          <h2 className="section-title">The Ecosystem</h2>
        </div>

        <div className="steps-grid">
          {[
            { num: "01", title: "Create Your Identity", desc: "Build a holographic profile. Add your skills and let the network discover your potential." },
            { num: "02", title: "Neural Connection", desc: "Find learners in the ecosystem who match your goals or hold the knowledge you seek." },
            { num: "03", title: "Shared Evolution", desc: "Exchange knowledge in real-time, complete challenges, and watch your XP grow." },
          ].map((step, i) => (
            <div key={step.num} className="step-card holo-card">
              <span className="step-number">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          SHARE YOUR SKILLS FORM
         ==================================================== */}
      <section className="form-section" ref={formSectionRef}>
        <div className="form-section-header">
          <div className="section-eyebrow">
            <span className="section-eyebrow-dot" /> Join the Network
          </div>
          <h2 className="section-title">Transmit Your Skills</h2>
          <p className="section-subtitle" style={{ margin: "12px auto 0", textAlign: "center" }}>
            Initialize your node in the network — we'll match you with the right peers automatically.
          </p>
        </div>

        <div className="form-showcase-container">
          <div className="form-embed-wrapper">
            <div className="window-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <div className="window-title">Skill_Transmission_Protocol.exe</div>
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
              Loading Protocol…
            </iframe>
          </div>
        </div>
      </section>

      {/* ====================================================
          POPULAR SKILLS — BENTO GRID
         ==================================================== */}
      <section className="skills-section">
        <div className="skills-section-header">
          <FadeUp>
            <div className="section-eyebrow">
              <span className="section-eyebrow-dot" /> Ecosystem Nodes
            </div>
            <h2 className="section-title">Trending Knowledge</h2>
          </FadeUp>
        </div>

        <div className="bento-grid">
          {SKILLS.map((skill, i) => (
            <FadeUp key={skill.title} delay={i * 0.1}>
              <div className="bento-card spotlight-card-enhanced">
                <span className="bento-card-icon">{skill.icon}</span>
                <h4>{skill.title}</h4>
                <p>{skill.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
