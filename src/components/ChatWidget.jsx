import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToMessages, sendMessage } from "../utils/appState";
import { auth } from "../firebase";
import "../styles/chat.css";

export default function ChatWidget({ peer, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!peer) return;
    const unsubscribe = subscribeToMessages(peer.id, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [peer]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !peer) return;

    const textToSend = inputText.trim();
    setInputText(""); // Optimistically clear input
    
    await sendMessage(peer.id, textToSend);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!peer) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="chat-widget-overlay"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="chat-header">
          <div className="chat-header-info">
            <img src={peer.avatar || "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"} alt={peer.name} className="chat-header-avatar" />
            <div>
              <h3>{peer.name}</h3>
              <span className="chat-status">Active now</span>
            </div>
          </div>
          <button className="btn-close-chat" onClick={onClose} aria-label="Close Chat">
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted)", margin: "auto", fontSize: "0.85rem" }}>
              Start a conversation with {peer.name}
            </div>
          ) : (
            messages.map((msg) => {
              const isSentByMe = msg.senderId === auth.currentUser?.uid;
              return (
                <div key={msg.id} className={`message-wrapper ${isSentByMe ? "sent" : "received"}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form className="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn-send" disabled={!inputText.trim()}>
              ➤
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
