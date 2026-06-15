import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { db } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log("Starting database seeding...");

  try {
    // 1. Run schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");
    await db.query(sql);
    console.log("Database schema initialized.");

    // 2. Hash passwords
    const adminPasswordHash = await bcrypt.hash("admin123", 12);

    // 3. Seed Admin User
    const adminResult = await db.query(
      `INSERT INTO users (name, email, password_hash, role, profile_complete)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ["TN Admin", "admin@tnuc.gh", adminPasswordHash, "admin", true],
    );
    const adminId = adminResult.rows[0].id;
    console.log(`Seeded admin user with ID: ${adminId}`);

    // 5. Seed Announcements (Some sponsored for monetization feature)
    const announcements = [
      {
        id: "a1",
        title: "UCC, DIMES IS COMING!!!!!!!",
        category: "Events",
        date: "2026-06-14",
        excerpt:
          "You asked, we listened. After all the DMs + requests, Dimes and the team are coming to UCC this Wednesday with the brooches. Stock is limited so come through early. See you soon, UCC.",
        body: "UCC, DIMES IS COMING!!!!!!!\n\nYou asked, we listened. After all the DMs + requests, Dimes and the team are coming to UCC this Wednesday with the brooches. Stock is limited so come through early. See you soon, UCC.",
        image: "/src/assets/ann-dimes.jpg",
        isSponsored: true,
        sponsorName: "Dimes Clothing",
        sponsorUrl: "https://instagram.com/dimes",
      },
      {
        id: "a2",
        title: "GLC Approves 19 Law Faculties for Direct Pre-Bar Progression",
        category: "Governance",
        date: "2026-06-14",
        excerpt:
          "The General Legal Council has approved 19 accredited law faculties to run both LLB and Pre-Bar programmes, introducing a new pathway that removes the entrance exam from 2026.",
        body: "The General Legal Council has approved 19 accredited law faculties to run both LLB and Pre-Bar programmes, introducing a new pathway that removes the traditional entrance exam and allows direct progression into a one-year Pre-Bar Course from 2026.\n\nThe move is expected to ease the long-standing backlog of law graduates and expand access to professional legal training nationwide ❗👀",
        image: "/src/assets/ann-legal.jpg",
        isSponsored: false,
        sponsorName: null,
        sponsorUrl: null,
      },
      {
        id: "a3",
        title: "Apply for the Hyundai Women in STEM Scholarship",
        category: "Scholarships",
        date: "2026-06-14",
        excerpt:
          "Are you a female high school senior or college undergraduate wishing to pursue a STEM-related field of education? Consider applying for the $10,000 Hyundai Women in STEM Scholarship!",
        body: `Are you a high school senior or college undergraduate who identifies as female, resides in the United States, and wishes to pursue a STEM-related field of education? If so, you might consider applying for the Hyundai Women in STEM Scholarship!

Each year, the scholarship awards $10,000 to five applicants who submit the most thoughtful 500-word (or less) essay in response to the following prompt:

At Hyundai, we know the success of a company is only equal to the talent of its team. We seek those who persevere, ask, “Why not?” and dare to make a difference. In 500 words or less, tell us how, as a woman in STEM, you’ll redefine convention by doing things differently, more efficiently. We want you to succeed—and hopefully even consider working with us one day.

If you’re passionate about STEM and wish to reduce your college debt, we encourage you to apply!`,
        image: "/src/assets/ann-hyundai-stem.png",
        isSponsored: true,
        sponsorName: "Hyundai USA",
        sponsorUrl: "https://hyundai.com/scholarship",
      },
      {
        id: "a4",
        title: "Annual general meeting — call for agenda items",
        category: "Governance",
        date: "2026-04-10",
        excerpt: "Members may submit agenda items for the 2026 AGM until 1 June.",
        body: "Our annual general meeting will take place on 22 July in Kumasi. We invite all registered members to submit agenda items via the contact form by 1 June 2026.",
        image: "/src/assets/ann-agm.jpg",
        isSponsored: false,
        sponsorName: null,
        sponsorUrl: null,
      },
    ];

    for (const a of announcements) {
      await db.query(
        `INSERT INTO announcements (id, title, category, date, excerpt, body, image, is_sponsored, sponsor_name, sponsor_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          a.id,
          a.title,
          a.category,
          a.date,
          a.excerpt,
          a.body,
          a.image,
          a.isSponsored,
          a.sponsorName,
          a.sponsorUrl,
        ],
      );
    }
    console.log("Seeded announcements.");

    // 6. Seed Blog Posts
    const blogs = [
      {
        id: "b1",
        title: "How Ghana's universities are reshaping research collaboration",
        category: "Research",
        author: "Dr. Ama Boateng",
        date: "2026-06-01",
        excerpt: "A look at the cross-institutional research networks emerging across Ghana.",
        body: "Over the last decade, Ghanaian universities have moved from siloed research to vibrant collaboration networks. From shared labs to joint publications, the country's higher-education ecosystem is becoming a model for the region.\n\nThis piece explores three case studies that show what is working — and what still needs to change. We examine the joint biotech program between UG and KNUST, the West African Climate Research Consortium led by UCC, and the new shared computing grid hosted at GIMPA.",
        image: "/src/assets/blog-1.jpg",
        featured: true,
        isSponsored: false,
        sponsorName: null,
        sponsorUrl: null,
      },
      {
        id: "b2",
        title: "A student's guide to studying abroad while keeping ties at home",
        category: "Student Life",
        author: "Kojo Asante",
        date: "2026-05-20",
        excerpt: "Practical advice for students considering exchange programs.",
        body: "Studying abroad opens doors, but maintaining connections at home matters too. We spoke with five returning students about scholarships, visas, homesickness, and how to keep your roots while spreading your wings.",
        image: "/src/assets/blog-5.jpg",
        featured: false,
        isSponsored: false,
        sponsorName: null,
        sponsorUrl: null,
      },
      {
        id: "b3",
        title: "Why employability should start in year one",
        category: "Careers",
        author: "Akosua Frimpong",
        date: "2026-05-10",
        excerpt: "Career services should be embedded from day one, not as an afterthought.",
        body: "Too many students arrive at graduation under-prepared for the job market. We argue that career development should begin in the first semester — through structured mentorship, paid internships, and skills passports that travel with students throughout their academic journey.",
        image: "/src/assets/blog-6.jpg",
        featured: false,
        isSponsored: true,
        sponsorName: "JobHouse Ghana",
        sponsorUrl: "https://jobhouse.com.gh",
      },
    ];

    for (const b of blogs) {
      await db.query(
        `INSERT INTO blog_posts (id, title, category, author, date, excerpt, body, image, featured, is_sponsored, sponsor_name, sponsor_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          b.id,
          b.title,
          b.category,
          b.author,
          b.date,
          b.excerpt,
          b.body,
          b.image,
          b.featured,
          b.isSponsored,
          b.sponsorName,
          b.sponsorUrl,
        ],
      );
    }
    console.log("Seeded blog posts.");

    // 7. Seed Settings
    const settings = [
      { key: "site_name", value: "TN Universities Connect" },
      { key: "tagline", value: "Guide. Work. Inspire." },
      { key: "contact_email", value: "hello@tnuc.gh" },
      { key: "contact_phone", value: "+233 30 250 0000" },
      {
        key: "description",
        value: "Uniting Ghana's universities, students, and alumni through one connected platform.",
      },
      { key: "allow_registration", value: "true" },
      { key: "email_notifications", value: "true" },
      { key: "maintenance", value: "false" },
    ];

    for (const s of settings) {
      await db.query("INSERT INTO settings (key, value) VALUES ($1, $2)", [s.key, s.value]);
    }
    console.log("Seeded settings.");

    // 8. Seed Contact Messages
    const messages = [
      {
        name: "Abena Mensah",
        email: "abena@example.com",
        subject: "Question about Hyundai Scholarship",
        message:
          "Hi, I wanted to find out if international students in Ghana can apply for the Hyundai Women in STEM scholarship? Thank you.",
        date: "2026-06-14",
        resolved: false,
      },
      {
        name: "Kofi Boateng",
        email: "kofi.b@example.com",
        subject: "Login Issues",
        message:
          "I cannot login with my student account. It keeps saying invalid credentials even though I reset it.",
        date: "2026-06-13",
        resolved: true,
      },
    ];

    for (const m of messages) {
      await db.query(
        `INSERT INTO contact_messages (name, email, subject, message, date, resolved)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [m.name, m.email, m.subject, m.message, m.date, m.resolved],
      );
    }
    console.log("Seeded contact messages.");

    console.log("Database seeding complete successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    process.exit(0);
  }
}

seed();
