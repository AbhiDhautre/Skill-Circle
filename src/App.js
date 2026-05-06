import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuroraBackground from "./components/AuroraBackground";
import CustomCursor from "./components/CustomCursor";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Gamification from "./pages/Gamification";
import FindSkills from "./pages/FindSkills";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CourseRoom from "./pages/CourseRoom";
import { auth } from "./firebase";
import { clearSessionState, syncProfileFromAuth, subscribeToUser } from "./utils/appState";
import "./App.css";
import "./styles/immersive.css";

gsap.registerPlugin(ScrollTrigger);

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const location = useLocation();

  /* ---- Lenis smooth scroll + GSAP ScrollTrigger ---- */
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* ---- Lenis smooth scroll ---- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, []);

  /* ---- Firebase auth listener ---- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        syncProfileFromAuth(user);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      } else {
        clearSessionState();
        setIsLoggedIn(false);
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  /* ---- Global Notification Alert Listener ---- */
  useEffect(() => {
    if (!isLoggedIn) return;
    
    let isFirstLoad = true;
    let prevNotifIds = new Set();
    
    const unsubscribe = subscribeToUser(({ notifications }) => {
      const currentNotifs = notifications || [];
      
      if (!isFirstLoad) {
        currentNotifs.forEach(n => {
          if (!prevNotifIds.has(n.id) && !n.read) {
            toast.info(`🔔 ${n.message}`);
          }
        });
      }
      
      prevNotifIds = new Set(currentNotifs.map(n => n.id));
      isFirstLoad = false;
    });
    
    return unsubscribe;
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authReady }}>
      <div className="page-shell">
        {/* Global immersive background */}
        <AuroraBackground />
        {/* Custom cursor — desktop only */}
        <CustomCursor />
        <Navbar />
        <main className="page-main">
          <div className="container page-content">
            <div key={location.pathname} className="route-transition">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gamification"
                  element={
                    <ProtectedRoute>
                      <Gamification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/findskills"
                  element={
                    <ProtectedRoute>
                      <FindSkills />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/room/:id"
                  element={
                    <ProtectedRoute>
                      <CourseRoom />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </div>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="dark"
          toastClassName="toast-theme"
        />
        <Analytics />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
