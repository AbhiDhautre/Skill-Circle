import React, { useState, useEffect } from "react";
import "../styles/findskills.css";
import { toast } from "react-toastify";
import {
  subscribeToAllUsers, subscribeToUser,
  sendConnectionRequest, acceptConnectionRequest, declineConnectionRequest,
  connectWithPeer, suggestedPeers,
  subscribeToSkillPosts, saveSkillPost
} from "../utils/appState";
import { auth } from "../firebase";
import SpotlightCard from "../components/SpotlightCard";

const getRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

export default function FindSkills() {
  const CLUSTERS = ["All", "Web Development", "App Development", "AI/ML", "UI/UX", "Backend", "Data Science"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("All");
  const [allUsers, setAllUsers] = useState(suggestedPeers);
  const [myProfile, setMyProfile] = useState({});
  const [myConnections, setMyConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [sending, setSending] = useState(null);

  // Skill Exchange Board states
  const [skillPosts, setSkillPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postSkillMatch, setPostSkillMatch] = useState("");
  const [isPosting, setIsPosting] = useState(false);

 
  useEffect(() => {
    const unsubscribe = subscribeToUser(({ profile, connections, incomingRequests }) => {
      setMyProfile(profile);
      setMyConnections(connections || []);
      setIncomingRequests(incomingRequests || []);
    });
    return () => unsubscribe();
  }, []);

  // Real-time all users
  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((users) => {
      const currentUid = auth.currentUser?.uid;
      const others = users.filter((u) => u.id !== currentUid);
      
      // Explicitly guarantee suggestedPeers are merged, avoiding duplicates by ID
      const othersIds = new Set(others.map(u => u.id));
      const missingPeers = suggestedPeers.filter(p => !othersIds.has(p.id));
      
      setAllUsers([...others, ...missingPeers]);
    });
    return () => unsubscribe();
  }, []);

  // Real-time skill posts
  useEffect(() => {
    const unsubscribe = subscribeToSkillPosts((posts) => {
      setSkillPosts(posts);
    });
    return () => unsubscribe();
  }, []);

  const isConnected = (userId) => myConnections.some((c) => c.id === userId);
  const hasSentRequest = (userId) => sentRequests.includes(userId);
  const hasIncomingRequest = (userId) => incomingRequests.find((r) => r.fromUid === userId);

  const handleSendRequest = async (user) => {
    if (!auth.currentUser) {
      toast.error("Please log in to send connection requests.");
      return;
    }
    setSending(user.id);

    // Real Firestore user: id is a string UID (length > 10 and not a number)
    const isRealUser = typeof user.id === "string" && isNaN(user.id) && user.id.length > 8;

    if (isRealUser) {
      // Send a real-time request that appears on their Dashboard/FindSkills
      const result = await sendConnectionRequest(user.id, myProfile);
      if (result.sent) {
        setSentRequests((prev) => [...prev, user.id]);
        toast.success(`Connection request sent to ${user.name}! 🤝`);
      } else {
        toast.error("Could not send request. Please try again.");
      }
    } else {
      // Mock/demo user — just save to local connections list
      const result = await connectWithPeer(user);
      if (result.added) {
        setSentRequests((prev) => [...prev, user.id]);
        toast.success(`Connected with ${user.name}! 🤝`);
      } else {
        toast.info(`You are already connected with ${user.name}`);
      }
    }
    setSending(null);
  };

  const handleAccept = async (request) => {
    await acceptConnectionRequest(request);
    toast.success(`You are now connected with ${request.fromName}! 🎉`);
  };

  const handleDecline = async (request) => {
    await declineConnectionRequest(request);
    toast.info(`Request from ${request.fromName} declined.`);
  };

  const filtered = allUsers.filter((user) => {
    const term = searchQuery.toLowerCase();
    const nameStr = (user.name || "").toLowerCase();
    const skillStr = (user.skill || "").toLowerCase();
    const roleStr = (user.role || "").toLowerCase();

    const matchesSearch = nameStr.includes(term) ||
                          skillStr.includes(term) ||
                          roleStr.includes(term);
    
    let matchesCluster = true;
    if (selectedCluster !== "All") {
      const clusterL = selectedCluster.toLowerCase();
      matchesCluster = skillStr.includes(clusterL) || roleStr.includes(clusterL);
      
      if (selectedCluster === "Web Development") {
        matchesCluster = matchesCluster || skillStr.includes("react") || skillStr.includes("frontend") || roleStr.includes("frontend");
      } else if (selectedCluster === "AI/ML" || selectedCluster === "Data Science") {
        matchesCluster = matchesCluster || skillStr.includes("python") || skillStr.includes("machine learning") || roleStr.includes("data");
      }
    }
    
    return matchesSearch && matchesCluster;
  }).sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const handleCreatePost = async () => {
    if (!auth.currentUser) {
      toast.error("Please log in to post.");
      return;
    }
    if (!postContent.trim() || !postSkillMatch.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    setIsPosting(true);
    try {
      await saveSkillPost({
        authorUid: auth.currentUser.uid,
        authorName: myProfile.name || "Skill Circle Learner",
        authorAvatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
        content: postContent,
        lookingFor: postSkillMatch,
      });
      toast.success("Skill request posted successfully! 🎉");
      setPostContent("");
      setPostSkillMatch("");
      setShowPostForm(false);
    } catch (err) {
      toast.error("Failed to post request.");
    }
    setIsPosting(false);
  };

  const renderActions = (user) => {
    // Case 1: Already connected
    if (isConnected(user.id)) {
      return <button className="connect-btn connected" disabled>✅ Connected</button>;
    }

    // Case 2: This user sent ME a request — show Accept / Decline inline
    const incomingFromThis = hasIncomingRequest(user.id);
    if (incomingFromThis) {
      return (
        <div className="inline-request-actions">
          <p className="incoming-label">🔔 Wants to connect with you</p>
          <div className="action-row">
            <button className="btn-accept" onClick={() => handleAccept(incomingFromThis)}>✓ Accept</button>
            <button className="btn-decline" onClick={() => handleDecline(incomingFromThis)}>✕ Decline</button>
          </div>
        </div>
      );
    }

    // Case 3: I already sent them a request
    if (hasSentRequest(user.id)) {
      return <button className="connect-btn pending" disabled>Request Sent</button>;
    }

    // Case 4: No relation — show Connect button
    return (
      <button
        className="connect-btn"
        onClick={() => handleSendRequest(user)}
        disabled={sending === user.id}
      >
        {sending === user.id ? "Sending..." : "Connect"}
      </button>
    );
  };

  return (
    <div className="findskills-page">
      <h1 className="page-title">Find Skills & Connect</h1>
      <p className="subtitle">
        Search for peers who have the skills you want to learn — or who need the skills you have.
      </p>

      <div className="search-section">
        <input
          type="text"
          className="search-bar input-surface"
          placeholder="Search by skill, name, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="cluster-select input-surface" 
          value={selectedCluster} 
          onChange={(e) => setSelectedCluster(e.target.value)}
          style={{ marginLeft: "14px", padding: "10px 16px", borderRadius: "12px", minWidth: "160px", background: "var(--surface)", color: "var(--surface-ink)", border: "1px solid var(--line)", outline: "none" }}
        >
          {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button 
          className="btn btn-primary ml-10" 
          onClick={() => setShowPostForm(!showPostForm)}
          style={{ marginLeft: "14px" }}
        >
          {showPostForm ? "✕ Cancel" : "+ Request a Skill"}
        </button>
      </div>

      {/* Post Creation Form */}
      {showPostForm && (
        <SpotlightCard className="create-post-card" spotlightColor="rgba(14, 165, 233, 0.2)">
          <h3 style={{ marginTop: 0, color: "var(--surface-ink)" }}>Ask the community for a connection</h3>
          <textarea
            className="input-surface mb-2"
            placeholder="E.g., I'm building a React app and need help with CSS design..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: "12px", resize: "vertical" }}
          />
          <input
            type="text"
            className="input-surface"
            placeholder="Looking for (Skill): e.g., UI/UX, Backend..."
            value={postSkillMatch}
            onChange={(e) => setPostSkillMatch(e.target.value)}
            style={{ width: "100%", marginBottom: "16px" }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleCreatePost}
            disabled={isPosting}
            style={{ width: "100%" }}
          >
            {isPosting ? "Posting..." : "Post Request"}
          </button>
        </SpotlightCard>
      )}

      {/* Skill Exchange Board (Live Posts) */}
      {skillPosts.length > 0 && !searchQuery && (
        <div className="skill-board">
          <h2 className="section-title">📢 Active Skill Requests</h2>
          <div className="board-grid">
            {skillPosts.map(post => (
              <SpotlightCard key={post.id} className="board-post-card">
                <div className="profile" style={{ marginBottom: "8px" }}>
                  <img src={post.authorAvatar} alt="User" className="avatar" style={{ width: "40px", height: "40px" }} />
                  <div>
                    <h4 style={{ margin: 0, color: "var(--surface-ink)" }}>{post.authorName}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {post.createdAt ? getRelativeTime(post.createdAt) : "Just now"}
                    </span>
                  </div>
                </div>
                <p className="post-content" style={{ margin: "8px 0", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  {post.content}
                </p>
                <div className="tag-row" style={{ marginTop: "12px" }}>
                  <span className="tag" style={{ background: "rgba(139, 92, 246, 0.15)", color: "var(--primary)" }}>
                    🔍 Looking for: {post.lookingFor}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
          <hr style={{ margin: "32px 0", border: "none", borderTop: "1px solid var(--line)" }} />
        </div>
      )}

      {/* Pending incoming requests count */}
      {incomingRequests.length > 0 && (
        <div className="pending-banner">
          🔔 You have <strong>{incomingRequests.length}</strong> pending connection request{incomingRequests.length !== 1 ? "s" : ""} below
        </div>
      )}

      <div className="skills-grid-header" style={{ textAlign: "left", marginBottom: "20px", color: "var(--muted)", fontWeight: "500", paddingLeft: "4px" }}>
        {filtered.length > 0 && (
          <p>Showing <strong>{filtered.length}</strong> {searchQuery ? `result${filtered.length !== 1 ? "s" : ""} for "${searchQuery}"` : selectedCluster !== "All" ? `${selectedCluster} profile${filtered.length !== 1 ? "s" : ""}` : `peer${filtered.length !== 1 ? "s" : ""}`} sorted by Top Ranking</p>
        )}
      </div>
      <div className="skills-grid">
        {filtered.length > 0 ? (
          filtered.map((user) => (
            <SpotlightCard
              key={user.id}
              className={`skill-card ${hasIncomingRequest(user.id) ? "has-request" : ""}`}
            >
              <div className="profile">
                <img src={user.avatar} alt="User" className="avatar" />
                <div>
                  <h3>{user.name}</h3>
                  <p className="role">{user.role}</p>
                </div>
              </div>
              <div className="info">
                <p><strong>Skill:</strong> {user.skill}</p>
                <p><strong>Looking for:</strong> {user.lookingFor}</p>
                <p><strong>Ranking:</strong> ⭐ {user.xp || 0} XP</p>
              </div>
              {renderActions(user)}
            </SpotlightCard>
          ))
        ) : (
          <p className="no-results">No matching users found</p>
        )}
      </div>
    </div>
  );
}
