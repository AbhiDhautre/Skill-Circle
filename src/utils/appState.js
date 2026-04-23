import { db, auth } from "../firebase";
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, query, orderBy,
  onSnapshot, arrayUnion, arrayRemove
} from "firebase/firestore";

// ─── Static Data ────────────────────────────────────────────────────────────

export const defaultCourses = [
  { id: 1, title: "React Frontend Development", mentor: "Aisha Sharma", duration: "6 weeks", tags: ["Frontend", "JavaScript", "React"], progress: 75, videoId: "bMknfKXIFA8" },
  { id: 2, title: "Data Structures & Algorithms", mentor: "Rohit Mehta", duration: "8 weeks", tags: ["C++", "Logic", "DSA"], progress: 25, videoId: "8hly31xKli0" },
  { id: 3, title: "UI/UX Design Essentials", mentor: "Nina Patel", duration: "4 weeks", tags: ["Figma", "Design Thinking"], progress: 100, videoId: "c9Wg6Cb_YlU" },
  { id: 4, title: "Machine Learning with Python", mentor: "Deep Verma", duration: "10 weeks", tags: ["AI", "Python", "ML"], progress: 40, videoId: "7eh4d6sabA0" },
  { id: 5, title: "Full Stack with Node.js", mentor: "Aarav Nair", duration: "12 weeks", tags: ["Backend", "Node", "MongoDB"], progress: 15, videoId: "Oe421EPjeEQ" },
  { id: 6, title: "Critical Thinking and Problem Solving", mentor: "LinkedIn Learning", duration: "1.5 hours", tags: ["Soft Skills", "Logic", "Free"], progress: 0, url: "https://www.linkedin.com/learning/critical-thinking-and-problem-solving" },
  { id: 7, title: "Communication Foundations", mentor: "LinkedIn Learning", duration: "2 hours", tags: ["Communication", "Soft Skills", "Free"], progress: 0, url: "https://www.linkedin.com/learning/communication-foundations" },
  { id: 8, title: "Time Management Fundamentals", mentor: "LinkedIn Learning", duration: "1.5 hours", tags: ["Productivity", "Soft Skills", "Free"], progress: 0, url: "https://www.linkedin.com/learning/time-management-fundamentals" },
  { id: 9, title: "Git Essential Training: The Basics", mentor: "LinkedIn Learning", duration: "2 hours", tags: ["Git", "Version Control", "Free"], progress: 0, url: "https://www.linkedin.com/learning/git-essential-training-the-basics" },
  { id: 10, title: "Python for Beginners", mentor: "FreeCodeCamp", duration: "4 hours", tags: ["Python", "Programming", "Free"], progress: 0, videoId: "rfscVS0vtbw", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }
];

export const defaultPosts = [
  { id: "post_1", author: "Aarav Nair", title: "Looking for a React study group!", content: "Hey everyone! I'm forming a small React JS study circle for this weekend. Anyone interested?", tags: ["React", "Frontend", "Collaboration"], time: "2h ago", likes: 4, comments: [], createdAt: Date.now() - 7200000 },
  { id: "post_2", author: "Nina Patel", title: "Need design feedback", content: "I've created a poster for the upcoming college fest and would love feedback from design folks.", tags: ["UI/UX", "Figma", "Design"], time: "5h ago", likes: 2, comments: [], createdAt: Date.now() - 18000000 },
  { id: "post_3", author: "Deep Verma", title: "DSA challenge for this week", content: "Let's solve 10 Leetcode questions together this weekend. Who's in?", tags: ["DSA", "Coding", "Problem Solving"], time: "1d ago", likes: 3, comments: [], createdAt: Date.now() - 86400000 }
];

export const suggestedPeers = [
  { id: 1, name: "Atharva Kanchan", skill: "Python, Java", role: "Intermediate CS", lookingFor: "AWS", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 2, name: "Mustafa Bhewala", skill: "JavaScript", role: "Intermediate Smad", lookingFor: "Web Development", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 3, name: "Mitanshu Sarode", skill: "Data Analytics", role: "Beginner SMAD", lookingFor: "Data Analytics", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 4, name: "Aditya Dilip Gavhane", skill: "Python, Java, SQL, Langchain, RAG", role: "Intermediate CSE", lookingFor: "Java", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 5, name: "Namrata Bade", skill: "SQL, Tableau, Python, C++", role: "Beginner ECE", lookingFor: "DSA", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 6, name: "Aryan Kanchan", skill: "Backend, AI", role: "Intermediate CSE", lookingFor: "Cloud Services", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 7, name: "Aditya Vijay Madane", skill: "Cloud, Big Data Analysis", role: "Intermediate CSE", lookingFor: "Python", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 8, name: "Tejaswini Bhujbal", skill: "Python, Java", role: "Intermediate Mitcom", lookingFor: "SQL", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 9, name: "Manasi Sanjay Kalbhor", skill: "Python, Machine Learning", role: "Beginner ECE", lookingFor: "Machine Learning and AI", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 10, name: "Anuj Ganesh Kanchan", skill: "Java, Web Development, AI/ML, SQL", role: "Intermediate AIA", lookingFor: "Java, Backend", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 11, name: "Samruddhi Chavan", skill: "Python", role: "Intermediate ECO", lookingFor: "DSA", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 12, name: "Joel Joseph", skill: "CAD, Coding, AI", role: "Beginner SOES", lookingFor: "CAD, Generative AI", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 13, name: "Gurneet Kaur Juneja", skill: "Web Development, App Development", role: "Intermediate IT", lookingFor: "React Native, Backend", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 14, name: "Aditi Chitnis", skill: "IAM, Cybersecurity", role: "Intermediate IT", lookingFor: "Cloud Security", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 15, name: "Mahima Kisan Kela", skill: "C++, Python, Java, JavaScript, Database", role: "Intermediate IT", lookingFor: "Web Development", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 16, name: "Tanishka Uttarkar", skill: "Python, AI/ML", role: "Intermediate CSE", lookingFor: "Artificial Intelligence", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 1850 },
  { id: 17, name: "Mrunal Bharati", skill: "AutoCAD, SketchUp", role: "Advanced Architecture", lookingFor: "Architecture Design", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 18, name: "Shravani Ghongde", skill: "Java", role: "Advanced IT", lookingFor: "Advanced Java", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 19, name: "Aarya Thengne", skill: "HTML/CSS, JavaScript, Python, SQL, ML", role: "Intermediate IT", lookingFor: "AI/ML, Cybersecurity", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 20, name: "Vedashree Kulkarni", skill: "Python, Java, C++, React.js, Node.js", role: "Intermediate CS", lookingFor: "Full Stack Development", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 21, name: "Santosh Nimbalkar", skill: "Management", role: "Intermediate AIA", lookingFor: "AWS", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 22, name: "Pravin Ranmale", skill: "Python", role: "Intermediate IT", lookingFor: "Machine Learning", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 23, name: "Vaishnavi Mojad", skill: "Python", role: "Intermediate IT", lookingFor: "Machine Learning", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 24, name: "Khyati Paruchuri", skill: "Python, Java, ML, DL", role: "Advanced CSE", lookingFor: "C++", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 25, name: "Varad Vikas Mandhare", skill: "C++, Cybersecurity", role: "Beginner E&TC", lookingFor: "Docker", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0},
  { id: 26, name: "Varad Vikas Mandhare", skill: "Cybersecurity", role: "Intermediate CS", lookingFor: "UI/UX Design", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 27, name: "Divya Shahaji Nagare", skill: "Data Entry", role: "Beginner BBA", lookingFor: "Digital Marketing", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 },
  { id: 28, name: "Kedar Pradip Kulkarni", skill: "Web Development", role: "Intermediate IT", lookingFor: "AI", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0},
  { id: 29, name: "Sayali Ingole", skill: "Data Analytics", role: "Intermediate CSE", lookingFor: "General", avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png", xp: 0 }
];

// In-memory cache for profile
let localProfileCache = {
  name: "",
  email: "",
  enrollmentNumber: "",
  primarySkill: "",
  bio: "Peer learner building skills one exchange at a time."
};


let hasSeededPosts = false; // prevent re-seeding on every mount

export function subscribeToPosts(callback) {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (posts.length === 0 && !hasSeededPosts) {
          // Seed default posts into Firestore ONCE so all users see them
          hasSeededPosts = true;
          try {
            for (const p of defaultPosts) {
              const { id, ...postData } = p; // strip local id, let Firestore generate one
              await addDoc(collection(db, "posts"), postData);
            }
            // onSnapshot will fire again automatically with the seeded posts
          } catch (seedErr) {
            console.warn("Could not seed posts to Firestore:", seedErr.message);
            callback(defaultPosts); // fallback to local defaults
          }
        } else {
          callback(posts.length > 0 ? posts : defaultPosts);
        }
      },
      (error) => {
        console.warn("Real-time posts listener error:", error.message);
        callback(defaultPosts);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToPosts setup error:", err.message);
    callback(defaultPosts);
    return () => { };
  }
}

/**
 * Subscribes to the current user's Firestore document in real-time.
 * Fires callback with { profile, enrollments, connections, xp }.
 * Returns an unsubscribe function.
 */
export function subscribeToUser(callback) {
  if (!auth.currentUser) {
    callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 1250 });
    return () => { };
  }

  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          localProfileCache = data.profile || localProfileCache;
          callback({
            profile: localProfileCache,
            enrollments: data.enrollments?.length ? data.enrollments : defaultCourses.slice(0, 3),
            connections: data.connections || [],
            xp: data.xp ?? 0,
            incomingRequests: data.incomingRequests || []
          });
        } else {
          callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 0, incomingRequests: [] });
        }
      },
      (error) => {
        console.warn("Real-time user listener error:", error.message);
        callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 0, incomingRequests: [] });
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToUser setup error:", err.message);
    callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 0 });
    return () => { };
  }
}

/**
 * Subscribes to ALL users in real-time (for leaderboard + Find Skills).
 * Returns an unsubscribe function.
 */
export function subscribeToAllUsers(callback) {
  try {
    const q = collection(db, "users");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.profile?.name || "Skill Circle Learner",
            xp: data.xp ?? 0,
            skill: data.profile?.primarySkill || "General",
            role: data.role || "Student",
            lookingFor: data.lookingFor || "Collaboration",
            avatar: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
            enrollmentNumber: data.profile?.enrollmentNumber || ""
          };
        });
        // Merge live Firebase users with our large list of suggested peers from the CSV
        callback([...users, ...suggestedPeers]);
      },
      (error) => {
        console.warn("Real-time all-users listener error:", error.message);
        callback(suggestedPeers);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToAllUsers setup error:", err.message);
    callback(suggestedPeers);
    return () => { };
  }
}

export function subscribeToCourses(callback) {
  // Bypassing Firestore for the static course catalog for instant loading & preventing duplicates
  callback(defaultCourses);
  return () => { };
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile() {
  if (!auth.currentUser) return localProfileCache;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      localProfileCache = docSnap.data().profile || localProfileCache;
    }
  } catch (error) {
    console.warn("Firestore error in getProfile:", error.message);
  }
  return localProfileCache;
}

export async function saveProfile(profile) {
  localProfileCache = { ...localProfileCache, ...profile };
  if (!auth.currentUser) return;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { profile: localProfileCache, enrollments: [], connections: [], xp: 0 });
    } else {
      await updateDoc(docRef, { profile: localProfileCache });
    }
  } catch (error) {
    console.warn("Firestore error in saveProfile:", error.message);
  }
}

export async function syncProfileFromAuth(user) {
  const currentProfile = await getProfile();
  const nextProfile = {
    ...currentProfile,
    name: currentProfile.name || user?.displayName || user?.email?.split("@")[0] || "Skill Circle Learner",
    email: currentProfile.email || user?.email || "",
    primarySkill: currentProfile.primarySkill || "React",
    bio: currentProfile.bio || "Peer learner building skills one exchange at a time."
  };
  await saveProfile(nextProfile);
  return nextProfile;
}

// ─── Courses ─────────────────────────────────────────────────────────────────

export function getCourses() {
  return defaultCourses;
}

export async function getEnrollments() {
  if (!auth.currentUser) return defaultCourses.slice(0, 3);
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().enrollments?.length) {
      return docSnap.data().enrollments;
    }
  } catch (error) {
    console.warn("Firestore error in getEnrollments:", error.message);
  }
  return defaultCourses.slice(0, 3);
}

export async function saveEnrollments(courses) {
  if (!auth.currentUser) return;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { enrollments: courses });
  } catch (error) {
    console.warn("Firestore error in saveEnrollments:", error.message);
  }
}

export async function enrollInCourse(course) {
  const enrollments = await getEnrollments();
  const alreadyEnrolled = enrollments.some((item) => item.id === course.id);
  if (alreadyEnrolled) return { added: false, enrollments };
  const updated = [{ ...course, progress: course.progress ?? 10 }, ...enrollments];
  await saveEnrollments(updated);
  await addXp(120);
  return { added: true, enrollments: updated };
}

export async function completeCourse(courseId) {
  const enrollments = await getEnrollments();
  const courseIndex = enrollments.findIndex((item) => item.id === courseId);
  if (courseIndex === -1 || enrollments[courseIndex].progress >= 100) {
    return { completed: false, enrollments };
  }
  enrollments[courseIndex].progress = 100;
  await saveEnrollments(enrollments);
  await addXp(150);
  return { completed: true, enrollments };
}

// ─── Connections ──────────────────────────────────────────────────────────────

export async function getConnections() {
  if (!auth.currentUser) return [];
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().connections) return docSnap.data().connections;
  } catch (error) {
    console.warn("Firestore error in getConnections:", error.message);
  }
  return [];
}

export async function saveConnections(connections) {
  if (!auth.currentUser) return;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { connections });
  } catch (error) {
    console.warn("Firestore error in saveConnections:", error.message);
  }
}

export async function connectWithPeer(peer) {
  const connections = await getConnections();
  const alreadyConnected = connections.some((item) => item.id === peer.id);
  if (alreadyConnected) return { added: false, connections };
  const updated = [{ ...peer, status: "Connected" }, ...connections];
  await saveConnections(updated);
  await addXp(60);
  return { added: true, connections: updated };
}

/**
 * Sends a real-time connection request to another user.
 * Writes into the TARGET user's incomingRequests array in Firestore.
 * Their onSnapshot listener fires automatically — they see it instantly.
 */
export async function sendConnectionRequest(targetUid, fromProfile) {
  if (!auth.currentUser) return { sent: false };
  const myUid = auth.currentUser.uid;
  if (myUid === targetUid) return { sent: false };

  const request = {
    fromUid: myUid,
    fromName: fromProfile.name || "Skill Circle Learner",
    fromSkill: fromProfile.primarySkill || "General",
    createdAt: Date.now(),
    status: "pending"
  };

  try {
    const targetRef = doc(db, "users", targetUid);
    await updateDoc(targetRef, { incomingRequests: arrayUnion(request) });
    // Also mark on sender's side
    const myRef = doc(db, "users", myUid);
    await updateDoc(myRef, {
      sentRequests: arrayUnion({ toUid: targetUid, toName: fromProfile.name, createdAt: Date.now() })
    });
    await addXp(30);
    return { sent: true };
  } catch (err) {
    console.warn("Error sending connection request:", err.message);
    return { sent: false };
  }
}

/**
 * Accepts an incoming connection request.
 * Removes from incomingRequests, adds to both users' connections.
 */
export async function acceptConnectionRequest(request) {
  if (!auth.currentUser) return;
  const myUid = auth.currentUser.uid;
  const myName = localProfileCache.name || "Skill Circle Learner";

  try {
    const myRef = doc(db, "users", myUid);
    const fromRef = doc(db, "users", request.fromUid);

    // Remove from my incoming requests
    await updateDoc(myRef, { incomingRequests: arrayRemove(request) });

    // Add to my connections
    await updateDoc(myRef, {
      connections: arrayUnion({ id: request.fromUid, name: request.fromName, skill: request.fromSkill, status: "Connected" })
    });

    // Add to sender's connections
    await updateDoc(fromRef, {
      connections: arrayUnion({ id: myUid, name: myName, skill: localProfileCache.primarySkill || "General", status: "Connected" })
    });

    await addXp(60);
  } catch (err) {
    console.warn("Error accepting connection request:", err.message);
  }
}

/**
 * Declines an incoming connection request.
 */
export async function declineConnectionRequest(request) {
  if (!auth.currentUser) return;
  try {
    const myRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(myRef, { incomingRequests: arrayRemove(request) });
  } catch (err) {
    console.warn("Error declining connection request:", err.message);
  }
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export async function savePost(post) {
  try {
    await addDoc(collection(db, "posts"), { ...post, createdAt: Date.now() });
  } catch (err) {
    console.warn("Error saving post:", err.message);
  }
}

// ─── XP ───────────────────────────────────────────────────────────────────────

export async function getXp() {
  if (!auth.currentUser) return 0;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().xp !== undefined) return docSnap.data().xp;
  } catch (error) {
    console.warn("Firestore error in getXp:", error.message);
  }
  return 0;
}

export async function addXp(amount) {
  if (!auth.currentUser) return 0;
  const currentXp = await getXp();
  const nextXp = currentXp + amount;
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { xp: nextXp });
  } catch (error) {
    console.warn("Firestore error in addXp:", error.message);
  }
  return nextXp;
}

export function clearSessionState() {
  localStorage.removeItem("isLoggedIn");
}

// ─── Skill Exchange Board ─────────────────────────────────────────────────────

/**
 * Saves a skill exchange post to Firestore.
 */
export async function saveSkillPost(post) {
  try {
    await addDoc(collection(db, "skillPosts"), {
      ...post,
      createdAt: Date.now()
    });
    await addXp(50);
  } catch (err) {
    console.warn("Error saving skill post:", err.message);
    throw err;
  }
}

/**
 * Real-time listener for all skill exchange posts.
 */
export function subscribeToSkillPosts(callback) {
  try {
    const q = query(collection(db, "skillPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(posts);
      },
      (error) => {
        console.warn("Skill posts listener error:", error.message);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToSkillPosts setup error:", err.message);
    callback([]);
    return () => { };
  }
}

