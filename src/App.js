import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Gamification from "./pages/Gamification";
import FindSkills from "./pages/FindSkills";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="page-shell">
        <Navbar />
        <main className="page-main">
          <div className="container page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/community" element={<Community />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/findskills" element={<FindSkills />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="light"
          toastClassName="toast-theme"
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
