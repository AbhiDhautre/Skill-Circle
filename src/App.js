import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Gamification from "./pages/Gamification";
import FindSkills from "./pages/FindSkills";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./firebase";
import { clearSessionState, syncProfileFromAuth } from "./utils/appState";
import Squares from "./components/reactbits/Squares";
import "./App.css";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const location = useLocation();

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

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authReady }}>
      <div className="page-shell">
        <Squares speed={0.5} squareSize={50} direction="diagonal" borderColor="rgba(255, 255, 255, 0.05)" hoverFillColor="#1a1a1a" />
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
          theme="light"
          toastClassName="toast-theme"
        />
        <Analytics />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
