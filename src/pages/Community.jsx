import React, { useState, useEffect, useRef } from "react";
import "../styles/community.css";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { subscribeToPosts, getProfile, savePost, togglePostLike, addXp } from "../utils/appState";

const getRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

const nameToColor = (name = "") => {
  const colors = ["#6366f1","#8b5cf6","#0ea5e9","#22d3ee","#10b981","#f59e0b","#f43f5e"];
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/* ---- 3D Tilt Wrapper for Post Card ---- */
function FeedTiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="post-card-wrapper">
      <motion.div
        ref={ref}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ author: "", title: "", content: "", tags: "" });
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile.name) setNewPost((cur) => ({ ...cur, author: profile.name }));
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((livePosts) => setPosts(livePosts));
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.title || !newPost.content) {
      toast.error("Please fill in all required parameters.");
      return;
    }
    const newPostObj = {
      author: newPost.author,
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags ? newPost.tags.split(",").map((t) => t.trim()) : [],
      time: "Just now",
      likes: 0,
      comments: [],
    };
    await savePost(newPostObj);
    const profile = await getProfile();
    setNewPost({ author: profile.name || "", title: "", content: "", tags: "" });
    setShowForm(false);
    await addXp(80);
    toast.success("Transmission successful.");
  };

  const currentUid = auth.currentUser?.uid;

  const handleLike = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const hasLiked = post.likedBy?.includes(currentUid);
    await togglePostLike(id, post.likes, post.likedBy || []);
    if (!hasLiked) await addXp(10);
  };

  const handleAddComment = async (id) => {
    if (!commentInputs[id]) {
      toast.info("Input empty.");
      return;
    }
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, comments: [...post.comments, commentInputs[id]] } : post
    );
    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [id]: "" });
    await addXp(20);
    toast.success("Signal added.");
  };

  const handleShare = async (post) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      toast.success("Coordinates copied to clipboard.");
    } catch {
      toast.error("Clipboard failure.");
    }
  };

  return (
    <div className="community-page">
      <motion.div
        className="community-header"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <h1>The Ecosystem</h1>
          <p className="subtitle">Connect with nodes, transmit knowledge, and synchronize your skills.</p>
        </div>
        <button
          className="btn-create-post"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Terminate Transmission" : "+ Initialize Transmission"}
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0, rotationX: 20 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 40, rotationX: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, rotationX: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", perspective: 1200 }}
          >
            <div className="create-post-form">
              <input type="text" name="author" placeholder="Node Name (Your Name)" value={newPost.author} onChange={handleInputChange} required />
              <input type="text" name="title" placeholder="Transmission Subject" value={newPost.title} onChange={handleInputChange} required />
              <textarea name="content" placeholder="Encode your knowledge or inquiry…" value={newPost.content} onChange={handleInputChange} required />
              <input type="text" name="tags" placeholder="Identifiers (comma separated)" value={newPost.tags} onChange={handleInputChange} />
              <button type="button" onClick={handleAddPost} className="btn-post-submit">
                Broadcast →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="feed">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 60, rotationX: 15 }}
            animate={{ opacity: 1, y: 0, rotationX: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <FeedTiltCard className="post-card">
              <div className="post-header">
                <div
                  className="post-avatar"
                  style={{ background: `linear-gradient(135deg, ${nameToColor(post.author)}, ${nameToColor(post.author + "1")})` }}
                >
                  {post.author?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="post-header-info">
                  <h3>{post.title}</h3>
                  <p className="author">Node: {post.author}</p>
                </div>
                <span className="time">{post.createdAt ? getRelativeTime(post.createdAt) : post.time}</span>
              </div>

              <p className="post-content">{post.content}</p>

              <div className="tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>

              <div className="actions">
                <button className="btn-action" onClick={() => handleLike(post.id)}>
                  {post.likedBy?.includes(currentUid) ? "💔 Disconnect" : "❤️ Resonate"} ({post.likes})
                </button>
                <button
                  className="btn-action"
                  onClick={() => setCommentInputs({ ...commentInputs, [post.id]: commentInputs[post.id] ?? "" })}
                >
                  💬 Append
                </button>
                <button className="btn-action" onClick={() => handleShare(post)}>🔗 Share Link</button>
              </div>

              {commentInputs[post.id] !== undefined && (
                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Input signal…"
                    value={commentInputs[post.id]}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                  />
                  <button onClick={() => handleAddComment(post.id)}>Transmit</button>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="comments-list">
                  {post.comments.map((c, i) => (
                    <p key={i} className="comment">{c}</p>
                  ))}
                </div>
              )}
            </FeedTiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
