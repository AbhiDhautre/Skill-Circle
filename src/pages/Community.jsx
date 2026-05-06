import React, { useState, useEffect } from "react";
import "../styles/community.css";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { subscribeToPosts, getProfile, savePost, togglePostLike, addXp, defaultPosts } from "../utils/appState";
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

export default function Community() {
  const [posts, setPosts] = useState(defaultPosts);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ author: "", title: "", content: "", tags: "" });
  const [commentInputs, setCommentInputs] = useState({});

  // Load author name once
  useEffect(() => {
    getProfile().then((profile) => {
      if (profile.name) {
        setNewPost((cur) => ({ ...cur, author: profile.name }));
      }
    });
  }, []);

  // Real-time posts listener — automatically updates when any user posts
  useEffect(() => {
    const unsubscribe = subscribeToPosts((livePosts) => {
      setPosts(livePosts);
    });
    return () => unsubscribe(); // cleanup on unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.title || !newPost.content) {
      toast.error("Please fill in all required fields.");
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
    await savePost(newPostObj); // real-time listener will pick this up automatically
    const profile = await getProfile();
    setNewPost({ author: profile.name || "", title: "", content: "", tags: "" });
    setShowForm(false);
    await addXp(80);
    toast.success("Post published to the community.");
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
      toast.info("Write a comment before posting.");
      return;
    }
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, comments: [...post.comments, commentInputs[id]] } : post
    );
    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [id]: "" });
    await addXp(20);
    toast.success("Comment added.");
  };

  const handleShare = async (post) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      toast.success("Post link copied to clipboard.");
    } catch {
      toast.error("Could not copy the post link.");
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div>
          <h1>Community</h1>
          <p className="subtitle">Connect with peers, share knowledge, and grow your skills together.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ Create Post"}
        </button>
      </div>

      {showForm && (
        <SpotlightCard className="create-post-form" spotlightColor="rgba(14, 165, 233, 0.2)">
          <input type="text" name="author" placeholder="Your Name" value={newPost.author} onChange={handleInputChange} required />
          <input type="text" name="title" placeholder="Post Title" value={newPost.title} onChange={handleInputChange} required />
          <textarea name="content" placeholder="Write something..." value={newPost.content} onChange={handleInputChange} required></textarea>
          <input type="text" name="tags" placeholder="Tags (comma separated)" value={newPost.tags} onChange={handleInputChange} />
          <button type="button" onClick={handleAddPost} className="btn btn-primary" style={{marginTop: "8px", width: "100%"}}>Post</button>
        </SpotlightCard>
      )}

      <div className="feed">
        {posts.map((post) => (
          <SpotlightCard key={post.id} className="post-card">
            <div className="post-header">
              <div>
                <h3>{post.title}</h3>
                <p className="author">By {post.author}</p>
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
                {post.likedBy?.includes(currentUid) ? "💔 Unlike" : "❤️ Like"} ({post.likes})
              </button>
              <button className="btn-action" onClick={() => setCommentInputs({ ...commentInputs, [post.id]: commentInputs[post.id] || "" })}>💬 Comment</button>
              <button className="btn-action" onClick={() => handleShare(post)}>🔗 Share</button>
            </div>

            {commentInputs[post.id] !== undefined && (
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id]}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                />
                <button onClick={() => handleAddComment(post.id)}>Post</button>
              </div>
            )}

            {post.comments.length > 0 && (
              <div className="comments-list">
                {post.comments.map((c, i) => (
                  <p key={i} className="comment"> {c}</p>
                ))}
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
