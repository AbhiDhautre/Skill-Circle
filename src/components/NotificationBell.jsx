import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToUser, markNotificationsAsRead, clearNotifications } from "../utils/appState";
import "../styles/notifications.css";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToUser((userData) => {
      setNotifications(userData.notifications || []);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Small delay so they can see the unread before it clears
      setTimeout(() => markNotificationsAsRead(notifications), 1500);
    }
  };

  const handleNotifClick = (notif) => {
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case "request": return "🤝";
      case "accept": return "🎉";
      case "message": return "💬";
      default: return "🔔";
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button className="bell-btn" onClick={handleToggle} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notifications-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notif-header">
              <h4>Notifications</h4>
              {notifications.length > 0 && (
                <button className="btn-clear-notifs" onClick={clearNotifications}>
                  Clear All
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">No new notifications</div>
              ) : (
                [...notifications].sort((a, b) => b.createdAt - a.createdAt).map((notif) => (
                  <div
                    key={notif.id}
                    className={`notif-item ${!notif.read ? "unread" : ""}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className="notif-icon">{getIcon(notif.type)}</div>
                    <div className="notif-content">
                      <p className="notif-msg">{notif.message}</p>
                      <span className="notif-time">{getRelativeTime(notif.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
