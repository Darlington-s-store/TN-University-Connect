// Database backed data access layer for announcements, blogs, messages, students, and settings.

export type Announcement = {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string;
  image?: string;
  isSponsored?: boolean;
  sponsorName?: string | null;
  sponsorUrl?: string | null;
  sponsorLogo?: string | null;
  published: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  body: string;
  image?: string;
  isSponsored?: boolean;
  sponsorName?: string | null;
  sponsorUrl?: string | null;
  sponsorLogo?: string | null;
  featured?: boolean;
  published: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  resolved: boolean;
};

export type Student = {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  university: string;
  faculty?: string;
  department: string;
  program: string;
  level: string;
  indexNumber: string;
  address: string;
  submittedAt: string;
  nationality?: string;
  status?: string;
  church?: string;
  niche?: string;
  schoolType?: string;
  uniType?: string;
  avatar?: string;
  joinedAt?: string;
  password?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  allowRegistration: boolean;
  emailNotifications: boolean;
  maintenance: boolean;
  chatbotEnabled: boolean;
  chatbotGreeting: string;
  chatbotSystemPrompt: string;
  chatbotModel: string;
};

export const UNIVERSITIES = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "University of Education, Winneba",
  "University for Development Studies",
  "Ghana Institute of Management and Public Administration",
  "Ashesi University",
  "Central University",
  "University of Professional Studies",
  "Ho Technical University",
];

export const DEPARTMENTS = [
  "Computer Science",
  "Business Administration",
  "Economics",
  "Engineering",
  "Medicine",
  "Law",
  "Education",
  "Agriculture",
  "Political Science",
  "Communications",
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("tnu_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ---------- Announcements ----------
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const res = await fetch(`${API_URL}/api/announcements`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch announcements");
  return data.announcements;
};

export const getAnnouncementsAdmin = async (): Promise<Announcement[]> => {
  const res = await fetch(`${API_URL}/api/announcements/admin/all`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch admin announcements");
  return data.announcements;
};

export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const res = await fetch(`${API_URL}/api/announcements/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch announcement");
  return data.announcement;
};

export const createAnnouncement = async (ann: Partial<Announcement>): Promise<Announcement> => {
  const res = await fetch(`${API_URL}/api/announcements/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ann),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create announcement");
  return data.announcement;
};

export const updateAnnouncement = async (
  id: string,
  ann: Partial<Announcement>,
): Promise<Announcement> => {
  const res = await fetch(`${API_URL}/api/announcements/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(ann),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update announcement");
  return data.announcement;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/announcements/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete announcement");
};

export const getReadAnnouncements = async (): Promise<string[]> => {
  const res = await fetch(`${API_URL}/api/announcements/read`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch read announcements");
  return data.readIds;
};

export const markAnnouncementAsRead = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/announcements/read/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark announcement as read");
};

// ---------- Blog ----------
export const getBlogs = async (): Promise<BlogPost[]> => {
  const res = await fetch(`${API_URL}/api/blogs`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch blogs");
  return data.blogs;
};

export const getBlogsAdmin = async (): Promise<BlogPost[]> => {
  const res = await fetch(`${API_URL}/api/blogs/admin/all`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch admin blogs");
  return data.blogs;
};

export const getBlogById = async (id: string): Promise<BlogPost> => {
  const res = await fetch(`${API_URL}/api/blogs/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch blog post");
  return data.blog;
};

export const createBlog = async (blog: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_URL}/api/blogs/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(blog),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create blog post");
  return data.blog;
};

export const updateBlog = async (id: string, blog: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_URL}/api/blogs/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(blog),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update blog post");
  return data.blog;
};

export const deleteBlog = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/blogs/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete blog post");
};

// ---------- Messages ----------
export const getMessages = async (): Promise<ContactMessage[]> => {
  const res = await fetch(`${API_URL}/api/messages/admin/all`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch contact messages");
  return data.messages;
};

export const submitMessage = async (msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> => {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit contact message");
  return data.contactMessage;
};

export const resolveMessage = async (id: string): Promise<ContactMessage> => {
  const res = await fetch(`${API_URL}/api/messages/admin/${id}/resolve`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to resolve message");
  return data.contactMessage;
};

export const deleteMessage = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/messages/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete message");
};

// ---------- Students (mock, localStorage-backed) ----------
const STUDENTS_KEY = "tnu_students";

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
}

const getSessionUser = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem("tnu_session_user");
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
};

const readStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    return raw ? (JSON.parse(raw) as Student[]) : [];
  } catch {
    return [];
  }
};

const writeStudents = (list: Student[]) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
};

const getAuthUserAvatar = (email?: string): string | undefined => {
  try {
    const raw = localStorage.getItem("tnu_users");
    if (!raw || !email) return undefined;
    const users = JSON.parse(raw) as Array<{ email: string; avatar?: string }>;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase())?.avatar;
  } catch {
    return undefined;
  }
};

export const getStudents = async (): Promise<Student[]> => {
  const list = readStudents();
  return list.map((s) => ({ ...s, avatar: s.avatar || getAuthUserAvatar(s.email) }));
};

export const getStudentById = async (id: string): Promise<Student> => {
  const list = readStudents();
  const s = list.find((x) => x.id === id);
  if (!s) throw new Error("Student not found");
  return { ...s, avatar: s.avatar || getAuthUserAvatar(s.email) };
};

export const getStudentMe = async (): Promise<Student | null> => {
  const session = getSessionUser();
  if (!session) return null;
  const list = readStudents();
  const mine =
    list.find((s) => s.userId === session.id) ||
    list.find((s) => s.email.toLowerCase() === session.email.toLowerCase());
  if (!mine) return null;
  return { ...mine, avatar: mine.avatar || session.avatar };
};

export const submitStudentForm = async (student: Partial<Student>): Promise<Student> => {
  const session = getSessionUser();
  const list = readStudents();
  const email = (student.email || session?.email || "").toLowerCase();
  const idx = list.findIndex(
    (s) =>
      (session && s.userId === session.id) ||
      (email && s.email.toLowerCase() === email),
  );

  const base: Student = {
    id: idx >= 0 ? list[idx].id : `s-${Date.now()}`,
    userId: session?.id,
    fullName: student.fullName || session?.name || "",
    email: student.email || session?.email || "",
    phone: student.phone || session?.phone || "",
    gender: student.gender || "other",
    dob: student.dob || new Date().toISOString().slice(0, 10),
    university: student.university || "",
    faculty: student.faculty,
    department: student.department || "",
    program: student.program || "",
    level: student.level || "",
    indexNumber: student.indexNumber || `STU${Math.floor(100000 + Math.random() * 900000)}`,
    address: student.address || "",
    submittedAt: idx >= 0 ? list[idx].submittedAt : new Date().toISOString(),
    nationality: student.nationality,
    status: student.status,
    church: student.church,
    niche: student.niche,
    schoolType: student.schoolType,
    uniType: student.uniType,
    avatar: student.avatar || (idx >= 0 ? list[idx].avatar : undefined) || session?.avatar,
    joinedAt: idx >= 0 ? list[idx].joinedAt : new Date().toISOString(),
  };

  if (idx >= 0) list[idx] = { ...list[idx], ...base };
  else list.push(base);
  writeStudents(list);
  return base;
};

export const deleteStudent = async (id: string): Promise<void> => {
  writeStudents(readStudents().filter((s) => s.id !== id));
};

export const saveStudentAdmin = async (student: Partial<Student>): Promise<Student> => {
  const list = readStudents();
  const email = (student.email || "").toLowerCase();
  const idx = list.findIndex(
    (s) =>
      (student.userId && s.userId === student.userId) ||
      (email && s.email.toLowerCase() === email),
  );
  const base: Student = {
    id: idx >= 0 ? list[idx].id : `s-${Date.now()}`,
    userId: student.userId,
    fullName: student.fullName || "",
    email: student.email || "",
    phone: student.phone || "",
    gender: student.gender || "other",
    dob: student.dob || new Date().toISOString().slice(0, 10),
    university: student.university || "",
    faculty: student.faculty,
    department: student.department || "",
    program: student.program || "",
    level: student.level || "",
    indexNumber: student.indexNumber || `STU${Math.floor(100000 + Math.random() * 900000)}`,
    address: student.address || "Accra, Ghana",
    submittedAt: idx >= 0 ? list[idx].submittedAt : new Date().toISOString(),
    nationality: student.nationality || "Ghanaian",
    status: student.status || "Active Student",
    church: student.church || "None",
    niche: student.niche || "General Studies",
    schoolType: student.schoolType,
    uniType: student.uniType,
    avatar: student.avatar || (idx >= 0 ? list[idx].avatar : undefined) || getAuthUserAvatar(student.email),
    joinedAt: idx >= 0 ? list[idx].joinedAt : new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = { ...list[idx], ...base };
  else list.push(base);
  writeStudents(list);
  return base;
};

export const sendMessageAdmin = async (params: {
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  channel: "email" | "sms" | "both";
}): Promise<{
  success: boolean;
  message: string;
  details: { emailSent: boolean; smsSent: boolean };
}> => {
  // Mocked send — pretends to deliver to the chosen channel.
  return {
    success: true,
    message: `Message queued for ${params.email || params.phone}`,
    details: {
      emailSent: params.channel !== "sms",
      smsSent: params.channel !== "email",
    },
  };
};

// ---------- Settings ----------
export const getSettings = async (): Promise<SiteSettings> => {
  const res = await fetch(`${API_URL}/api/settings`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch settings");
  return data.settings;
};

export const saveSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update settings");
  return data.settings;
};

export const resetPasswordAdmin = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const raw = localStorage.getItem("tnu_users");
    if (!raw) return;
    const users = JSON.parse(raw) as Array<{ id: string; password?: string }>;
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx].password = newPassword;
      localStorage.setItem("tnu_users", JSON.stringify(users));
    }
  } catch {
    /* noop */
  }
};

// ---------- Analytics ----------
export interface AnalyticsSummary {
  stats: {
    totalStudents: number;
    totalUniversities: number;
    newThisMonth: number;
    activeMembers: number;
  };
  registrationTrends: {
    month: string;
    students: number;
    active: number;
  }[];
  genderDistribution: {
    name: string;
    value: number;
  }[];
  universityDistribution: {
    name: string;
    value: number;
  }[];
  departmentDistribution: {
    name: string;
    value: number;
  }[];
  recentStudents: Student[];
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const res = await fetch(`${API_URL}/api/analytics/admin/summary`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch analytics summary");
  return data;
};
