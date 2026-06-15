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

// ---------- Students ----------
export const getStudents = async (): Promise<Student[]> => {
  const res = await fetch(`${API_URL}/api/students/admin/all`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch student profiles");
  return data.students;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const res = await fetch(`${API_URL}/api/students/admin/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch student details");
  return data.student;
};

export const getStudentMe = async (): Promise<Student | null> => {
  const res = await fetch(`${API_URL}/api/students/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch own student profile");
  return data.student;
};

export const submitStudentForm = async (student: Partial<Student>): Promise<Student> => {
  const res = await fetch(`${API_URL}/api/students`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit student form");
  return data.student;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/students/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete student profile");
};

export const saveStudentAdmin = async (student: Partial<Student>): Promise<Student> => {
  const res = await fetch(`${API_URL}/api/students/admin/save`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save student profile");
  return data.student;
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
  const res = await fetch(`${API_URL}/api/auth/admin/reset-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId, password: newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
};
