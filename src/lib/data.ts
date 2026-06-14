// Local storage backed data for announcements, blog, messages, students.

export type Announcement = {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string;
  image?: string;
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

import annDimes from "@/assets/ann-dimes.jpg";
import annLegal from "@/assets/ann-legal.jpg";
import annHyundaiStem from "@/assets/ann-hyundai-stem.png";
import annAgm from "@/assets/ann-agm.jpg";

// ---------- Announcements ----------
const ANN_KEY = "tnu_announcements_v5";
const announcementSeed: Announcement[] = [
  {
    id: "a1",
    title: "UCC, DIMES IS COMING!!!!!!!",
    category: "Events",
    date: "2026-06-14",
    excerpt:
      "You asked, we listened. After all the DMs + requests, Dimes and the team are coming to UCC this Wednesday with the brooches. Stock is limited so come through early. See you soon, UCC.",
    body: "UCC, DIMES IS COMING!!!!!!!\n\nYou asked, we listened. After all the DMs + requests, Dimes and the team are coming to UCC this Wednesday with the brooches. Stock is limited so come through early. See you soon, UCC.",
    image: annDimes,
    published: true,
  },
  {
    id: "a2",
    title: "GLC Approves 19 Law Faculties for Direct Pre-Bar Progression",
    category: "Governance",
    date: "2026-06-14",
    excerpt:
      "The General Legal Council has approved 19 accredited law faculties to run both LLB and Pre-Bar programmes, introducing a new pathway that removes the entrance exam from 2026.",
    body: "The General Legal Council has approved 19 accredited law faculties to run both LLB and Pre-Bar programmes, introducing a new pathway that removes the traditional entrance exam and allows direct progression into a one-year Pre-Bar Course from 2026.\n\nThe move is expected to ease the long-standing backlog of law graduates and expand access to professional legal training nationwide ❗👀",
    image: annLegal,
    published: true,
  },
  {
    id: "a3",
    title: "Apply for the Hyundai Women in STEM Scholarship",
    category: "Scholarships",
    date: "2026-06-14",
    excerpt:
      "Are you a female high school senior or college undergraduate wishing to pursue a STEM-related field of education? Consider applying for the $10,000 Hyundai Women in STEM Scholarship!",
    body: "Are you a high school senior or college undergraduate who identifies as female, resides in the United States, and wishes to pursue a STEM-related field of education? If so, you might consider applying for the Hyundai Women in STEM Scholarship!\n\nEach year, the scholarship awards $10,000 to five applicants who submit the most thoughtful 500-word (or less) essay in response to the following prompt:\n\nAt Hyundai, we know the success of a company is only equal to the talent of its team. We seek those who persevere, ask, “Why not?” and dare to make a difference. In 500 words or less, tell us how, as a woman in STEM, you’ll redefine convention by doing things differently, more efficiently. We want you to succeed—and hopefully even consider working with us one day.\n\nIf you’re passionate about STEM and wish to reduce your college debt, we encourage you to apply!\n\nEligibility information\nThis scholarship is open to female high school seniors and college undergraduates who wish to pursue a STEM degree. Applicants must also meet the below eligibility requirements.\n\n• Grade Level: High School Seniors & College Students\n• Academic Interest: Agriculture, Food Science/Nutrition, Horticulture/Floriculture, Natural Resources, Environmental Science, Paper and Pulp Engineering, Computer Science, Engineering, etc.\n• Gender: Female\n• Citizenship Status: U.S. Citizens, Permanent Residents",
    image: annHyundaiStem,
    published: true,
  },
  {
    id: "a4",
    title: "Annual general meeting — call for agenda items",
    category: "Governance",
    date: "2026-04-10",
    excerpt: "Members may submit agenda items for the 2026 AGM until 1 June.",
    body: "Our annual general meeting will take place on 22 July in Kumasi. We invite all registered members to submit agenda items via the contact form by 1 June 2026.",
    image: annAgm,
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
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import blog7 from "@/assets/blog-7.jpg";

const BLOG_KEY = "tnu_blogs_v4";
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
    image: blog5,
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
    image: blog6,
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
    image: blog7,
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
