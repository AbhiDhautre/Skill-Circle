import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/courses.css";
import { toast } from "react-toastify";
import { enrollInCourse, subscribeToCourses, defaultCourses, subscribeToUser, completeCourse } from "../utils/appState";
import SpotlightCard from "../components/SpotlightCard";

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
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p className="subtitle">
          Learn from your peers and mentors across campus — anytime, anywhere.
        </p>
        <input
          type="text"
          className="search-box input-surface"
          placeholder="Search for a course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="courses-grid">
        {filtered.length > 0 ? (
          filtered.map((course) => {
            const enrolledData = enrollments.find((e) => String(e.id) === String(course.id));
            const progress = enrolledData ? enrolledData.progress : 0;

            return (
              <SpotlightCard key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <p className="mentor">By {course.mentor}</p>
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
                    Enroll Now
                  </button>
                ) : (
                  <>
                    <div className="course-progress-bar">
                      <div className="course-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="muted" style={{ margin: "0 0 4px", fontSize: "0.8rem" }}>{progress}% completed</p>
                    {progress < 100 ? (
                      <div className="course-actions">
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/room/${course.id}`)}
                        >
                          ▶ View
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
                      <p className="course-completed-label">🎉 Course Completed</p>
                    )}
                  </>
                )}
              </SpotlightCard>
            );
          })
        ) : (
          <p className="no-results">{courses.length === 0 ? "Loading courses..." : "No courses found."}</p>
        )}
      </div>
    </div>
  );
}
