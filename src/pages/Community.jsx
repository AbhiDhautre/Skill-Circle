import React, { useState, useEffect } from "react";
import "../styles/community.css";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    author: "",
    title: "",
    content: "",
    tags: "",
  });
  const [commentInputs, setCommentInputs] = useState({}); 

  
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("communityPosts"));
    if (savedPosts && savedPosts.length > 0) {
      setPosts(savedPosts);
    } else {
      setPosts([
        {
          id: 1,
          author: "Aarav Nair",
          title: "Looking for a React study group!",
          content:
            "Hey everyone! I’m forming a small React JS study circle for this weekend. Anyone interested?",
          tags: ["React", "Frontend", "Collaboration"],
          time: "2h ago",
          likes: 4,
          comments: [],
        },
        {
          id: 2,
          author: "Nina Patel",
          title: "Need design feedback",
          content:
            "I’ve created a poster for the upcoming college fest — would love some feedback from design folks.",
          tags: ["UI/UX", "Figma", "Design"],
          time: "5h ago",
          likes: 2,
          comments: [],
        },
        {
          id: 3,
          author: "Deep Verma",
          title: "DSA challenge for this week",
          content:
            "Let’s solve 10 Leetcode questions together this weekend! Who’s in?",
          tags: ["DSA", "Coding", "Problem Solving"],
          time: "1d ago",
          likes: 3,
          comments: [],
        },
      ]);
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("communityPosts", JSON.stringify(posts));
  }, [posts]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

 
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.title || !newPost.content) {
      alert("Please fill in all required fields.");
      return;
    }

    const newPostObj = {
      id: Date.now(),
      author: newPost.author,
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags ? newPost.tags.split(",").map((t) => t.trim()) : [],
      time: "Just now",
      likes: 0,
      comments: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ author: "", title: "", content: "", tags: "" });
    setShowForm(false);
  };


  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };


  const handleAddComment = (id) => {
    if (!commentInputs[id]) return;
    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: [...post.comments, commentInputs[id]],
          }
        : post
    );
    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [id]: "" });
  };


  const handleShare = (post) => {
    navigator.clipboard.writeText(
      `${window.location.href}?post=${post.id}`
    );
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="community-page">
    
      <div className="community-header">
        <div>
          <h1>Community</h1>
          <p className="subtitle">
            Connect with peers, share knowledge, and grow your skills together.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ Create Post"}
        </button>
      </div>

      
      {showForm && (
        <form className="create-post-form" onSubmit={handleAddPost}>
          <input
            type="text"
            name="author"
            placeholder="Your Name"
            value={newPost.author}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={newPost.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Write something..."
            value={newPost.content}
            onChange={handleInputChange}
            required
          ></textarea>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={newPost.tags}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary">
            Post
          </button>
        </form>
      )}

     
      <div className="feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div>
                <h3>{post.title}</h3>
                <p className="author">By {post.author}</p>
              </div>
              <span className="time">{post.time}</span>
            </div>

            <p className="post-content">{post.content}</p>

            <div className="tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="actions">
              <button className="btn-action" onClick={() => handleLike(post.id)}>
                ❤️ Like ({post.likes})
              </button>
              <button
                className="btn-action"
                onClick={() =>
                  setCommentInputs({
                    ...commentInputs,
                    [post.id]: commentInputs[post.id] || "",
                  })
                }
              >
                💬 Comment
              </button>
              <button className="btn-action" onClick={() => handleShare(post)}>
                🔗 Share
              </button>
            </div>

           
            {commentInputs[post.id] !== undefined && (
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id]}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post.id]: e.target.value,
                    })
                  }
                />
                <button onClick={() => handleAddComment(post.id)}>Post</button>
              </div>
            )}

           
            {post.comments.length > 0 && (
              <div className="comments-list">
                {post.comments.map((c, i) => (
                  <p key={i} className="comment">
                     {c}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
