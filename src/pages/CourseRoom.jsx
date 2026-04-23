import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SpotlightCard from "../components/SpotlightCard";
import { defaultCourses } from "../utils/appState";
import "../styles/courseroom.css";

export default function CourseRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const found = defaultCourses.find((c) => String(c.id) === String(id));
    setCourse(found);
  }, [id]);

  if (!course) {
    return (
      <div className="courseroom-page">
        <p className="muted" style={{ textAlign: "center", paddingTop: "6rem" }}>Loading course…</p>
      </div>
    );
  }

  return (
    <div className="courseroom-page">

      {/* Header */}
      <div className="courseroom-header">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          ← Back to Courses
        </button>
        <h1>{course.title}</h1>
        <p className="courseroom-meta">
          <span>By {course.mentor}</span>
          <span className="dot">·</span>
          <span>⏱ {course.duration}</span>
        </p>
        <div className="tags" style={{ marginTop: "10px" }}>
          {course.tags?.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Main content */}
      {course.videoId ? (
        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${course.videoId}`}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : course.url ? (
        <SpotlightCard className="external-card">
          <div className="external-icon">🔗</div>
          <h2>Premium External Course</h2>
          <p>This course is hosted on <strong>{course.mentor}</strong>. Click the button below to open it in a new tab, then come back here when done.</p>
          <a
            href={course.url}
            target="_blank"
            rel="noreferrer"
            className="launch-btn"
          >
            Launch Course ↗
          </a>
        </SpotlightCard>
      ) : null}

      {/* Course overview */}
      <div className="courseroom-overview">
        <h3>About this Course</h3>
        <p>
          Complete this <strong>{course.duration}</strong> course to master{" "}
          <strong>{course.tags.join(", ")}</strong>. When you've finished, head back to the
          Courses page and click <strong>"✓ Mark Complete"</strong> to earn your XP reward!
        </p>
      </div>

    </div>
  );
}
