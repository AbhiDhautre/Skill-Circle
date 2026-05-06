import { db, auth } from "../firebase";
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, query, orderBy,
  onSnapshot, arrayUnion, arrayRemove, where
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


// In-memory cache for profile


// In-memory cache for profile
let localProfileCache = {
  name: "",
  email: "",
  enrollmentNumber: "",
  primarySkill: "",
  bio: "Peer learner building skills one exchange at a time."
};



export function subscribeToPosts(callback) {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(posts);
      },
      (error) => {
        console.warn("Real-time posts listener error:", error.message);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToPosts setup error:", err.message);
    callback([]);
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
            incomingRequests: data.incomingRequests || [],
            notifications: data.notifications || []
          });
        } else {
          callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 0, incomingRequests: [], notifications: [] });
        }
      },
      (error) => {
        console.warn("Real-time user listener error:", error.message);
        callback({ profile: localProfileCache, enrollments: defaultCourses.slice(0, 3), connections: [], xp: 0, incomingRequests: [], notifications: [] });
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
        // Only return live users from Firebase
        callback(users);
      },
      (error) => {
        console.warn("Real-time all-users listener error:", error.message);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToAllUsers setup error:", err.message);
    callback([]);
    return () => { };
  }
}

/**
 * Aggregates global stats from Firestore in real-time.
 */
export function subscribeToStats(callback) {
  try {
    const q = collection(db, "users");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data());
      
      const activeLearners = snapshot.size;
      
      // Count unique skills
      const skills = new Set();
      users.forEach(u => {
        if (u.profile?.primarySkill) skills.add(u.profile.primarySkill);
      });
      const skillsShared = skills.size || 5; // Fallback for aesthetic

      // Sessions done can be total connections across all users / 2 (or just total links)
      let totalConnections = 0;
      users.forEach(u => {
        totalConnections += (u.connections?.length || 0);
      });
      const sessionsDone = Math.floor(totalConnections / 2) + 5; // Add some base for existing mock-like feel

      callback({
        activeLearners,
        skillsShared,
        sessionsDone
      });
    });
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToStats error:", err.message);
    callback({ activeLearners: 12, skillsShared: 20, sessionsDone: 25 });
    return () => {};
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
    
    // Add notification for the target user
    await addNotification(targetUid, {
      type: "request",
      message: `${fromProfile.name || "A peer"} sent you a connection request.`,
      link: "/findskills"
    });

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

    // Notify the sender that I accepted
    await addNotification(request.fromUid, {
      type: "accept",
      message: `${myName} accepted your connection request!`,
      link: "/dashboard"
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

// ─── Notifications ────────────────────────────────────────────────────────────

export async function addNotification(targetUid, notification) {
  try {
    const targetRef = doc(db, "users", targetUid);
    const newNotif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      read: false,
      ...notification
    };
    await updateDoc(targetRef, { notifications: arrayUnion(newNotif) });
  } catch (err) {
    console.warn("Error adding notification:", err.message);
  }
}

export async function markNotificationsAsRead(notifications) {
  if (!auth.currentUser || !notifications || notifications.length === 0) return;
  
  const unreadNotifs = notifications.filter(n => !n.read);
  if (unreadNotifs.length === 0) return;

  try {
    const myRef = doc(db, "users", auth.currentUser.uid);
    // Remove all old unread and add them back as read
    // Since arrayRemove requires exact object match, we do it in a loop or rewrite the whole array
    // Rewriting the array is safer and easier for this use case
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    await updateDoc(myRef, { notifications: updatedNotifs });
  } catch (err) {
    console.warn("Error marking notifications as read:", err.message);
  }
}

export async function clearNotifications() {
  if (!auth.currentUser) return;
  try {
    const myRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(myRef, { notifications: [] });
  } catch (err) {
    console.warn("Error clearing notifications:", err.message);
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

export async function togglePostLike(postId, currentLikes, likedBy = []) {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const hasLiked = likedBy.includes(uid);
  try {
    await updateDoc(doc(db, "posts", postId), {
      likes: hasLiked ? currentLikes - 1 : currentLikes + 1,
      likedBy: hasLiked ? arrayRemove(uid) : arrayUnion(uid),
    });
  } catch (err) {
    console.warn("Error toggling like:", err.message);
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

// ─── Real-Time Chat ───────────────────────────────────────────────────────────

export function getChatId(uid1, uid2) {
  // Sort alphabetically to ensure consistent chat ID regardless of who started it
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

export async function sendMessage(peerId, text) {
  if (!auth.currentUser) return { sent: false };
  const myUid = auth.currentUser.uid;
  const chatId = getChatId(myUid, peerId);
  
  try {
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    
    // Ensure the chat document exists
    await setDoc(chatRef, {
      participants: [myUid, peerId],
      lastUpdated: Date.now(),
      lastMessage: text,
      lastSenderId: myUid,
      lastSenderName: localProfileCache.name || "Skill Circle Learner"
    }, { merge: true });

    // Add the message
    await addDoc(messagesRef, {
      senderId: myUid,
      text: text,
      createdAt: Date.now()
    });

    // Notify the receiver
    await addNotification(peerId, {
      type: "message",
      message: `New message from ${localProfileCache.name || "a peer"}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
      link: "/dashboard"
    });

    return { sent: true };
  } catch (err) {
    console.warn("Error sending message:", err.message);
    return { sent: false };
  }
}

export function subscribeToMessages(peerId, callback) {
  if (!auth.currentUser) {
    callback([]);
    return () => {};
  }
  
  const myUid = auth.currentUser.uid;
  const chatId = getChatId(myUid, peerId);
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  try {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
      },
      (error) => {
        console.warn("Messages listener error:", error.message);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToMessages setup error:", err.message);
    callback([]);
    return () => {};
  }
}

export function subscribeToAllChats(callback) {
  if (!auth.currentUser) {
    callback([]);
    return () => {};
  }
  
  const myUid = auth.currentUser.uid;
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", myUid)
  );

  try {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(chats);
      },
      (error) => {
        console.warn("Chats listener error:", error.message);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToAllChats setup error:", err.message);
    callback([]);
    return () => {};
  }
}

