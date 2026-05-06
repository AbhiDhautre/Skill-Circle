import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "../styles/courses.css";
import { toast } from "react-toastify";
import { enrollInCourse, subscribeToCourses, defaultCourses, subscribeToUser, completeCourse } from "../utils/appState";

function TiltCard3D({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

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
    <div className="course-card-wrapper" style={{ perspective: 1500 }}>
      <motion.div
        ref={ref}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(defaultCourses);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCourses((liveCourses) => {
      setCourses(liveCourses);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToUser((data) => {
      setEnrollments(data.enrollments || []);
    });
    return () => unsubscribe();
  }, []);

  const filtered = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.mentor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="courses-page">
      <motion.div
        className="courses-header"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1>Explore Courses</h1>
        <p className="subtitle">
          Learn from your peers and mentors across the network — highly interactive, highly immersive.
        </p>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search the learning ecosystem…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="courses-grid">
        {filtered.length > 0 ? (
          filtered.map((course, idx) => {
            const enrolledData = enrollments.find((e) => String(e.id) === String(course.id));
            const progress = enrolledData ? enrolledData.progress : 0;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40, rotationX: 15 }}
                animate={{ opacity: 1, y: 0, rotationX: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard3D className="course-card holo-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <p className="mentor">Mentor: {course.mentor}</p>
                  </div>
                  <div className="course-body">
                    <p className="duration">⏱ {course.duration}</p>
                    <div className="tags">
                      {course.tags?.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {!enrolledData ? (
                    <button
                      className="btn-enroll"
                      onClick={async () => {
                        try {
                          const result = await enrollInCourse(course);
                          toast[result.added ? "success" : "info"](
                            result.added
                              ? `Enrolled in ${course.title}`
                              : `You are already enrolled in ${course.title}`
                          );
                        } catch (e) {
                          toast.error("Failed to enroll! Please try again.");
                        }
                      }}
                    >
                      Enroll Now →
                    </button>
                  ) : (
                    <>
                      <div className="course-progress-bar">
                        <div className="course-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="muted" style={{ margin: "0", fontSize: "0.8rem", transform: "translateZ(15px)" }}>{progress}% completed</p>
                      {progress < 100 ? (
                        <div className="course-actions">
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/room/${course.id}`)}
                          >
                            ▶ Enter Room
                          </button>
                          <button
                            className="btn-mark-complete"
                            onClick={async () => {
                              const res = await completeCourse(course.id);
                              if (res.completed) toast.success("Course Completed! +150 XP 🎉");
                            }}
                          >
                            ✓ Mark Complete
                          </button>
                        </div>
                      ) : (
                        <p className="course-completed-label" style={{ transform: "translateZ(25px)" }}>🎉 Course Mastered</p>
                      )}
                    </>
                  )}
                </TiltCard3D>
              </motion.div>
            );
          })
        ) : (
          <p className="no-results">{courses.length === 0 ? "Synchronizing courses…" : "No nodes found matching your query."}</p>
        )}
      </div>
    </div>
  );
}
