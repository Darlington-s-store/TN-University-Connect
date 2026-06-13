// Local storage backed data for announcements, blog, messages, students.

export type Announcement = {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string;
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
  gender: "male" | "female" | "other";
  dob: string;
  university: string;
  department: string;
  program: string;
  level: string;
  indexNumber: string;
  address: string;
  submittedAt: string;
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

function read<T>(key: string, seed: T): T {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Announcements ----------
const ANN_KEY = "tnu_announcements";
const announcementSeed: Announcement[] = [
  {
    id: "a1",
    title: "2026 National University Symposium opens registration",
    category: "Events",
    date: "2026-05-28",
    excerpt: "All member universities are invited to the annual symposium in Accra this August.",
    body: "TN Universities Connect is proud to announce that registration is now open for the 2026 National University Symposium. The three-day event will be held at the Accra International Conference Centre from 12–14 August. Sessions will cover research collaboration, student mobility, and the future of higher education in West Africa.",
    published: true,
  },
  {
    id: "a2",
    title: "New mentorship program pairs alumni with first-year students",
    category: "Programs",
    date: "2026-05-15",
    excerpt: "Over 200 alumni have signed up to mentor incoming students this academic year.",
    body: "Our new mentorship initiative connects experienced alumni with first-year students across member universities. Mentees are paired by program of study and career interest. Apply through the member dashboard before 30 June.",
    published: true,
  },
  {
    id: "a3",
    title: "Scholarship opportunities for STEM students announced",
    category: "Scholarships",
    date: "2026-04-30",
    excerpt: "Twenty fully-funded scholarships available for STEM graduate students.",
    body: "TN Universities Connect, in partnership with Ghana's Ministry of Education, is offering twenty fully-funded scholarships to outstanding graduate students in Science, Technology, Engineering, and Mathematics. Apply via the announcements portal.",
    published: true,
  },
  {
    id: "a4",
    title: "Annual general meeting — call for agenda items",
    category: "Governance",
    date: "2026-04-10",
    excerpt: "Members may submit agenda items for the 2026 AGM until 1 June.",
    body: "Our annual general meeting will take place on 22 July in Kumasi. We invite all registered members to submit agenda items via the contact form by 1 June 2026.",
    published: true,
  },
];
export const getAnnouncements = () => read(ANN_KEY, announcementSeed);
export const saveAnnouncements = (list: Announcement[]) => write(ANN_KEY, list);

// ---------- Blog ----------
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";

const BLOG_KEY = "tnu_blogs_v2";
const blogSeed: BlogPost[] = [
  {
    id: "b1",
    title: "How Ghana's universities are reshaping research collaboration",
    category: "Research",
    author: "Dr. Ama Boateng",
    date: "2026-06-01",
    excerpt: "A look at the cross-institutional research networks emerging across Ghana.",
    body: "Over the last decade, Ghanaian universities have moved from siloed research to vibrant collaboration networks. From shared labs to joint publications, the country's higher-education ecosystem is becoming a model for the region.\n\nThis piece explores three case studies that show what is working — and what still needs to change. We examine the joint biotech program between UG and KNUST, the West African Climate Research Consortium led by UCC, and the new shared computing grid hosted at GIMPA.\n\nWhat unites these efforts is a shift in mindset: institutions are no longer competing for limited prestige, they are pooling resources to amplify impact. The result is faster publication cycles, larger grant wins, and graduate students who get exposure to a much wider network of mentors.",
    image: blog1,
    featured: true,
    published: true,
  },
  {
    id: "b2",
    title: "A student's guide to studying abroad while keeping ties at home",
    category: "Student Life",
    author: "Kojo Asante",
    date: "2026-05-20",
    excerpt: "Practical advice for students considering exchange programs.",
    body: "Studying abroad opens doors, but maintaining connections at home matters too. We spoke with five returning students about scholarships, visas, homesickness, and how to keep your roots while spreading your wings.\n\nKey takeaways: start the scholarship search at least 12 months out, build a weekly check-in habit with family, and find at least one Ghanaian student association at your destination campus before you arrive.",
    image: blog3,
    published: true,
  },
  {
    id: "b3",
    title: "Why employability should start in year one",
    category: "Careers",
    author: "Akosua Frimpong",
    date: "2026-05-10",
    excerpt: "Career services should be embedded from day one, not as an afterthought.",
    body: "Too many students arrive at graduation under-prepared for the job market. We argue that career development should begin in the first semester — through structured mentorship, paid internships, and skills passports that travel with students throughout their academic journey.\n\nThe most successful programs we studied tie career milestones directly into the academic calendar, so students never have to choose between coursework and professional development.",
    image: blog4,
    published: true,
  },
  {
    id: "b4",
    title: "Five Ghanaian universities making waves in sustainability",
    category: "Sustainability",
    author: "Yaw Owusu",
    date: "2026-04-22",
    excerpt: "From solar-powered campuses to zero-waste cafeterias.",
    body: "Sustainability is no longer optional. These five institutions are leading the way — with rooftop solar, community gardens, plastic-free policies, and a sharp focus on the UN's Sustainable Development Goals.\n\nUG Legon has cut campus electricity emissions by 22% in two years. Ashesi runs an entirely paperless admissions process. UCC's marine biology department has turned its coastal research station into a community education hub.",
    image: blog2,
    published: true,
  },
];
export const getBlogs = () => read(BLOG_KEY, blogSeed);
export const saveBlogs = (list: BlogPost[]) => write(BLOG_KEY, list);

// ---------- Messages ----------
const MSG_KEY = "tnu_messages";
export const getMessages = (): ContactMessage[] => read(MSG_KEY, []);
export const saveMessages = (list: ContactMessage[]) => write(MSG_KEY, list);

// ---------- Students ----------
const STU_KEY = "tnu_students";
const studentSeed: Student[] = [
  {
    id: "s1",
    fullName: "Kwame Mensah",
    email: "kwame@tnuc.gh",
    phone: "+233 24 123 4567",
    gender: "male",
    dob: "2002-03-12",
    university: "University of Ghana",
    department: "Computer Science",
    program: "BSc Computer Science",
    level: "300",
    indexNumber: "UG10234567",
    address: "Legon, Accra",
    submittedAt: "2026-05-01",
  },
  {
    id: "s2",
    fullName: "Akosua Frimpong",
    email: "akosua@tnuc.gh",
    phone: "+233 20 555 1212",
    gender: "female",
    dob: "2001-08-04",
    university: "Kwame Nkrumah University of Science and Technology",
    department: "Engineering",
    program: "BSc Mechanical Engineering",
    level: "400",
    indexNumber: "KN20198812",
    address: "Kumasi",
    submittedAt: "2026-05-04",
  },
  {
    id: "s3",
    fullName: "Yaw Owusu",
    email: "yaw@tnuc.gh",
    phone: "+233 27 999 0011",
    gender: "male",
    dob: "2003-01-22",
    university: "University of Cape Coast",
    department: "Economics",
    program: "BSc Economics",
    level: "200",
    indexNumber: "UC20221034",
    address: "Cape Coast",
    submittedAt: "2026-05-09",
  },
  {
    id: "s4",
    fullName: "Adwoa Sarpong",
    email: "adwoa@tnuc.gh",
    phone: "+233 26 444 7788",
    gender: "female",
    dob: "2002-11-30",
    university: "Ashesi University",
    department: "Business Administration",
    program: "BSc Business Administration",
    level: "300",
    indexNumber: "AS20201189",
    address: "Berekuso",
    submittedAt: "2026-05-15",
  },
  {
    id: "s5",
    fullName: "Kojo Asante",
    email: "kojo@tnuc.gh",
    phone: "+233 24 222 3344",
    gender: "male",
    dob: "2000-06-18",
    university: "University of Ghana",
    department: "Law",
    program: "LLB",
    level: "400",
    indexNumber: "UG10119922",
    address: "Accra",
    submittedAt: "2026-05-20",
  },
];
export const getStudents = (): Student[] => read(STU_KEY, studentSeed);
export const saveStudents = (list: Student[]) => write(STU_KEY, list);
