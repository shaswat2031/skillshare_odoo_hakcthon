// Mock database - In a real app, this would connect to a database
export let users = [
  {
    id: 1,
    name: "Marc Demo",
    email: "marc@demo.com",
    password: "password123",
    location: "New York",
    profilePhoto: "/placeholder-avatar.jpg",
    skillsOffered: ["React", "Node.js", "JavaScript"],
    skillsWanted: ["Python", "Machine Learning"],
    availability: "weekends",
    profile: "public",
    rating: 3.5,
  },
  {
    id: 2,
    name: "Michell",
    email: "michell@demo.com",
    password: "password123",
    location: "San Francisco",
    profilePhoto: "/placeholder-avatar.jpg",
    skillsOffered: ["Python", "Data Science"],
    skillsWanted: ["React", "Frontend"],
    availability: "evenings",
    profile: "public",
    rating: 2.5,
  },
  {
    id: 3,
    name: "Joe Wills",
    email: "joe@demo.com",
    password: "password123",
    location: "Chicago",
    profilePhoto: "/placeholder-avatar.jpg",
    skillsOffered: ["Java", "Spring", "AWS"],
    skillsWanted: ["DevOps", "Docker"],
    availability: "weekdays",
    profile: "public",
    rating: 4.0,
  },
];

export let skillRequests = [
  {
    id: 1,
    fromUserId: 1,
    toUserId: 2,
    offeredSkill: "React",
    wantedSkill: "Python",
    message:
      "Hi! I'd love to learn Python from you in exchange for React knowledge.",
    status: "pending",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: 2,
    fromUserId: 3,
    toUserId: 1,
    offeredSkill: "Java",
    wantedSkill: "JavaScript",
    message:
      "Looking to improve my JavaScript skills, can teach Java in return.",
    status: "rejected",
    createdAt: new Date("2025-01-09"),
  },
  {
    id: 3,
    fromUserId: 2,
    toUserId: 3,
    offeredSkill: "Python",
    wantedSkill: "AWS",
    message: "I'd love to learn AWS from you! Let's swap skills.",
    status: "accepted",
    createdAt: new Date("2025-01-08"),
    googleMeetLink: "https://meet.google.com/abc-defg-hij",
    meetingTitle: "Skill Swap: Python ↔ AWS",
    scheduledFor: new Date("2025-01-13T14:00:00"),
    meetingInstructions:
      "Join the Google Meet call to swap skills: Python ↔ AWS",
  },
];

// Helper functions
export const getUserById = (id) =>
  users.find((user) => user.id === parseInt(id));
export const getUserByEmail = (email) =>
  users.find((user) => user.email === email);

// Generate Google Meet link
export const generateGoogleMeetLink = (
  fromUser,
  toUser,
  offeredSkill,
  wantedSkill
) => {
  // In a real application, you would use Google Calendar API to create a proper meeting
  // For demo purposes, we'll create a realistic-looking meet link
  const meetingId = Math.random().toString(36).substring(2, 15);
  const meetingTitle = `Skill Swap: ${offeredSkill} ↔ ${wantedSkill}`;
  const participants = `${fromUser.email}, ${toUser.email}`;

  // Generate a realistic Google Meet URL
  const baseUrl = "https://meet.google.com/";
  const meetingCode =
    meetingId.substring(0, 3) +
    "-" +
    meetingId.substring(3, 7) +
    "-" +
    meetingId.substring(7, 10);

  return {
    meetLink: baseUrl + meetingCode,
    meetingTitle,
    participants,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    instructions: `Join the Google Meet call to swap skills: ${offeredSkill} ↔ ${wantedSkill}`,
  };
};

export const createUser = (userData) => {
  const newUser = {
    id: users.length + 1,
    ...userData,
    rating: 0,
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id, updates) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return null;
};

export const createSkillRequest = (requestData) => {
  const newRequest = {
    id: skillRequests.length + 1,
    ...requestData,
    createdAt: new Date(),
  };
  skillRequests.push(newRequest);
  return newRequest;
};

export const updateSkillRequest = (id, updates) => {
  const requestIndex = skillRequests.findIndex(
    (req) => req.id === parseInt(id)
  );
  if (requestIndex !== -1) {
    skillRequests[requestIndex] = {
      ...skillRequests[requestIndex],
      ...updates,
    };
    return skillRequests[requestIndex];
  }
  return null;
};

export const getSkillRequestsByUserId = (userId) => {
  return skillRequests.filter((req) => req.toUserId === parseInt(userId));
};
