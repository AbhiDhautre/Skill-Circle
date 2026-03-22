import React, { useState } from "react";
import "../styles/courses.css";
import { toast } from "react-toastify";




export default function Courses() {
  const [query, setQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "React Frontend Development",
      mentor: "Aisha Sharma",
      duration: "6 weeks",
      tags: ["Frontend", "JavaScript", "React"],
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      mentor: "Rohit Mehta",
      duration: "8 weeks",
      tags: ["C++", "Logic", "DSA"],
    },
    {
      id: 3,
      title: "UI/UX Design Essentials",
      mentor: "Nina Patel",
      duration: "4 weeks",
      tags: ["Figma", "Design Thinking"],
    },
    {
      id: 4,
      title: "Machine Learning with Python",
      mentor: "Deep Verma",
      duration: "10 weeks",
      tags: ["AI", "Python", "ML"],
    },
    {
      id: 5,
      title: "Full Stack with Node.js",
      mentor: "Aarav Nair",
      duration: "12 weeks",
      tags: ["Backend", "Node", "MongoDB"],
    },
  ];

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p className="subtitle">
          Learn from your peers and mentors across campus — anytime, anywhere.
        </p>

        <input
          type="text"
          className="search-box input-surface"
          placeholder="Search for a course..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filtered.length > 0 ? (
          filtered.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <p className="mentor">By {course.mentor}</p>
              </div>
              <div className="course-body">
                <p className="duration">⏱ {course.duration}</p>
                <div className="tags">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => toast.info(" Enrolled successfully!")}> Enroll Now !</button>
            </div>
          ))
        ) : (
          <p className="no-results">No courses found.</p>
        )}
      </div>
      
    </div>
  );
}
