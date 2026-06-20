export type SchoolType = "University" | "Nursing & Midwifery" | "College of Education";
export type UniType = "Public" | "Technical" | "Private";

export interface GhanaSchool {
  name: string;
  type: SchoolType;
  uniType?: UniType;
}

export const GHANA_SCHOOLS: GhanaSchool[] = [
  // Public Universities
  { name: "University of Ghana (UG) - Legon", type: "University", uniType: "Public" },
  {
    name: "Kwame Nkrumah University of Science and Technology (KNUST)",
    type: "University",
    uniType: "Public",
  },
  { name: "University of Cape Coast (UCC)", type: "University", uniType: "Public" },
  { name: "University of Education, Winneba (UEW)", type: "University", uniType: "Public" },
  { name: "University for Development Studies (UDS)", type: "University", uniType: "Public" },
  {
    name: "University of Professional Studies, Accra (UPSA)",
    type: "University",
    uniType: "Public",
  },
  { name: "University of Mines and Technology (UMaT)", type: "University", uniType: "Public" },
  {
    name: "University of Energy and Natural Resources (UENR)",
    type: "University",
    uniType: "Public",
  },
  {
    name: "University of Health and Allied Sciences (UHAS)",
    type: "University",
    uniType: "Public",
  },
  {
    name: "Ghana Communication Technology University (GCTU)",
    type: "University",
    uniType: "Public",
  },
  {
    name: "University of Skills Training and Entrepreneurial Development (USTED)",
    type: "University",
    uniType: "Public",
  },
  {
    name: "SD Dombo University of Business and Integrated Development Studies (UBIDS)",
    type: "University",
    uniType: "Public",
  },
  {
    name: "C. K. Tedam University of Technology and Applied Sciences (CKT-UTAS)",
    type: "University",
    uniType: "Public",
  },

  // Technical Universities
  { name: "Accra Technical University (ATU)", type: "University", uniType: "Technical" },
  { name: "Kumasi Technical University (KsTU)", type: "University", uniType: "Technical" },
  { name: "Koforidua Technical University (KTU)", type: "University", uniType: "Technical" },
  { name: "Cape Coast Technical University (CCTU)", type: "University", uniType: "Technical" },
  { name: "Takoradi Technical University (TTU)", type: "University", uniType: "Technical" },
  { name: "Ho Technical University (HTU)", type: "University", uniType: "Technical" },
  { name: "Tamale Technical University (TaTU)", type: "University", uniType: "Technical" },
  { name: "Sunyani Technical University (STU)", type: "University", uniType: "Technical" },
  { name: "Bolgatanga Technical University (BTU)", type: "University", uniType: "Technical" },
  { name: "Wa Technical University (WTU)", type: "University", uniType: "Technical" },

  // Private Universities
  { name: "Ashesi University", type: "University", uniType: "Private" },
  { name: "Central University", type: "University", uniType: "Private" },
  { name: "Valley View University", type: "University", uniType: "Private" },
  { name: "Pentecost University", type: "University", uniType: "Private" },
  { name: "Methodist University Ghana", type: "University", uniType: "Private" },
  { name: "Catholic University of Ghana", type: "University", uniType: "Private" },
  { name: "Wisconsin International University College", type: "University", uniType: "Private" },
  {
    name: "Regent University College of Science and Technology",
    type: "University",
    uniType: "Private",
  },
  { name: "Academic City University College", type: "University", uniType: "Private" },
  { name: "Lancaster University Ghana", type: "University", uniType: "Private" },
  { name: "Webster University Ghana", type: "University", uniType: "Private" },
  { name: "Radford University College", type: "University", uniType: "Private" },
  { name: "Zenith University College", type: "University", uniType: "Private" },
  { name: "All Nations University", type: "University", uniType: "Private" },
  { name: "BlueCrest University College", type: "University", uniType: "Private" },

  // Nursing & Midwifery Colleges
  { name: "Korle-Bu Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "37 Military Hospital Nurses Training College", type: "Nursing & Midwifery" },
  { name: "Pantang Nurses Training College", type: "Nursing & Midwifery" },
  { name: "Kumasi Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Sekondi Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Tamale Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Cape Coast Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Koforidua Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Ho Nurses Training College", type: "Nursing & Midwifery" },
  { name: "Sunyani Nurses and Midwifery Training College", type: "Nursing & Midwifery" },
  { name: "Ankaful Psychiatric Nurses Training College", type: "Nursing & Midwifery" },

  // Colleges of Education
  { name: "Accra College of Education", type: "College of Education" },
  { name: "Wesley College of Education (Kumasi)", type: "College of Education" },
  { name: "Mount Mary College of Education (Somanya)", type: "College of Education" },
  { name: "Presbyterian College of Education (Akropong)", type: "College of Education" },
  { name: "St. Augustine's College of Education", type: "College of Education" },
  { name: "Komenda College of Education", type: "College of Education" },
  { name: "Gbewaah College of Education (Pusiga)", type: "College of Education" },
  { name: "Tamale College of Education", type: "College of Education" },
  { name: "Berekum College of Education", type: "College of Education" },
  { name: "Fosu College of Education", type: "College of Education" },
  { name: "Peki College of Education", type: "College of Education" },
  { name: "St. Francis College of Education (Hohoe)", type: "College of Education" },
  { name: "Bagabaga College of Education (Tamale)", type: "College of Education" },
  { name: "Kibi College of Education", type: "College of Education" },
  { name: "St. Monica's College of Education (Mampong)", type: "College of Education" },
];

export const FACULTIES = [
  "Faculty of Science",
  "Faculty of Arts & Humanities",
  "Faculty of Social Sciences",
  "Faculty of Engineering & Technology",
  "Faculty of Health Sciences & Nursing",
  "Faculty of Law",
  "Faculty of Business & Management Studies",
  "Faculty of Education",
  "Faculty of Agriculture & Natural Resources",
];

export const DEPARTMENTS = [
  "Computer Science & IT",
  "Mathematics & Statistics",
  "Physics & Chemistry",
  "Nursing & Midwifery",
  "Public Health",
  "General Education & Teacher Training",
  "Mechanical & Electrical Engineering",
  "Civil & Environmental Engineering",
  "Accounting & Finance",
  "Marketing & Procurement",
  "Economics & Development Studies",
  "Political Science & History",
  "Modern Languages & Communication Studies",
  "Law & Legal Studies",
  "Crop & Soil Sciences",
];

export const PROGRAMMES = [
  "BSc Computer Science",
  "BSc Information Technology",
  "BSc Software Engineering",
  "BSc Nursing (General)",
  "BSc Midwifery",
  "BSc Public Health",
  "Bachelor of Education (Basic Education)",
  "Bachelor of Education (Secondary Education)",
  "BSc Business Administration",
  "BSc Accounting",
  "BSc Marketing",
  "BSc Mechanical Engineering",
  "BSc Electrical/Electronic Engineering",
  "BSc Civil Engineering",
  "Bachelor of Laws (LLB)",
  "BA Economics",
  "BA Political Science",
  "BA Communication Studies",
  "Diploma in Basic Education",
  "Diploma in Nursing",
  "Diploma in Midwifery",
];

export const LEVELS = ["100", "200", "300", "400", "Graduate", "Alumni", "Completed"];

export const CHURCHES = [
  "Methodist Church Ghana",
  "Presbyterian Church of Ghana",
  "Pentecost Church",
  "Action Chapel International",
  "ICGC (International Central Gospel Church)",
  "Catholic Church",
  "Anglican Church",
  "Lighthouse Chapel International",
  "Assemblies of God",
  "Seventh-day Adventist (SDA)",
  "Baptist Church",
  "Charismatic/Evangelical (Other)",
  "Non-denominational Christian",
  "Other / Islamic / None",
];

export const NICHES = [
  "Corporate Events & Protocol Personnel",
  "Marketing, Publicity & Brand Awareness",
  "Healthcare, Wellness & Safety",
  "Technical, Engineering & IT Support",
  "Media Production & Post-Production",
  "Professional Grooming & Aesthetics",
  "Enterprise, Leadership & Business Strategy",
  "Voice & Audio Branding",
  "Field Sales & Market Activations",
  "Performance & Commercial Talent",
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function persistSettings(patch: any) {
  try {
    const token = localStorage.getItem("tnu_token");
    await fetch(`${API_URL}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(patch),
    });
  } catch (err) {
    console.error("Failed to persist schools settings:", err);
  }
}

// Memory caches initialized with localStorage fallbacks
let customSchools: GhanaSchool[] = (() => {
  const raw = localStorage.getItem("tnu_custom_schools");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let hiddenSchools: string[] = (() => {
  const raw = localStorage.getItem("tnu_hidden_schools");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let customFaculties: string[] = (() => {
  const raw = localStorage.getItem("tnu_custom_faculties");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let hiddenFaculties: string[] = (() => {
  const raw = localStorage.getItem("tnu_hidden_faculties");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let customProgrammes: string[] = (() => {
  const raw = localStorage.getItem("tnu_custom_programmes");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let hiddenProgrammes: string[] = (() => {
  const raw = localStorage.getItem("tnu_hidden_programmes");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let customLevels: string[] = (() => {
  const raw = localStorage.getItem("tnu_custom_levels");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

let hiddenLevels: string[] = (() => {
  const raw = localStorage.getItem("tnu_hidden_levels");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

export function initSchools(settings: any) {
  if (settings.customSchools) {
    customSchools = settings.customSchools;
    localStorage.setItem("tnu_custom_schools", JSON.stringify(settings.customSchools));
  }
  if (settings.hiddenSchools) {
    hiddenSchools = settings.hiddenSchools;
    localStorage.setItem("tnu_hidden_schools", JSON.stringify(settings.hiddenSchools));
  }
  if (settings.customFaculties) {
    customFaculties = settings.customFaculties;
    localStorage.setItem("tnu_custom_faculties", JSON.stringify(settings.customFaculties));
  }
  if (settings.hiddenFaculties) {
    hiddenFaculties = settings.hiddenFaculties;
    localStorage.setItem("tnu_hidden_faculties", JSON.stringify(settings.hiddenFaculties));
  }
  if (settings.customProgrammes) {
    customProgrammes = settings.customProgrammes;
    localStorage.setItem("tnu_custom_programmes", JSON.stringify(settings.customProgrammes));
  }
  if (settings.hiddenProgrammes) {
    hiddenProgrammes = settings.hiddenProgrammes;
    localStorage.setItem("tnu_hidden_programmes", JSON.stringify(settings.hiddenProgrammes));
  }
  if (settings.customLevels) {
    customLevels = settings.customLevels;
    localStorage.setItem("tnu_custom_levels", JSON.stringify(settings.customLevels));
  }
  if (settings.hiddenLevels) {
    hiddenLevels = settings.hiddenLevels;
    localStorage.setItem("tnu_hidden_levels", JSON.stringify(settings.hiddenLevels));
  }
}

export function getHiddenSchools(): string[] {
  return hiddenSchools;
}

export function saveHiddenSchools(hidden: string[]) {
  hiddenSchools = hidden;
  localStorage.setItem("tnu_hidden_schools", JSON.stringify(hidden));
  persistSettings({ hiddenSchools: hidden });
}

export function getGhanaSchools(): GhanaSchool[] {
  const hidden = getHiddenSchools();
  const all = [...GHANA_SCHOOLS, ...customSchools];
  const seen = new Set<string>();
  return all.filter((s) => {
    if (hidden.includes(s.name)) return false;
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });
}

export function getCustomSchools(): GhanaSchool[] {
  return customSchools;
}

export function saveCustomSchools(custom: GhanaSchool[]) {
  customSchools = custom;
  localStorage.setItem("tnu_custom_schools", JSON.stringify(custom));
  persistSettings({ customSchools: custom });
}

// ── Faculties ──────────────────────────────────────────

export function getFaculties(): string[] {
  const custom = getCustomFaculties();
  const hidden = getHiddenFaculties();
  return [...FACULTIES, ...custom]
    .filter((f) => !hidden.includes(f))
    .filter((f, i, arr) => arr.indexOf(f) === i);
}

export function getCustomFaculties(): string[] {
  return customFaculties;
}

export function saveCustomFaculties(list: string[]) {
  customFaculties = list;
  localStorage.setItem("tnu_custom_faculties", JSON.stringify(list));
  persistSettings({ customFaculties: list });
}

export function getHiddenFaculties(): string[] {
  return hiddenFaculties;
}

export function saveHiddenFaculties(hidden: string[]) {
  hiddenFaculties = hidden;
  localStorage.setItem("tnu_hidden_faculties", JSON.stringify(hidden));
  persistSettings({ hiddenFaculties: hidden });
}

// ── Programmes ─────────────────────────────────────────

export function getProgrammes(): string[] {
  const custom = getCustomProgrammes();
  const hidden = getHiddenProgrammes();
  return [...PROGRAMMES, ...custom]
    .filter((p) => !hidden.includes(p))
    .filter((p, i, arr) => arr.indexOf(p) === i);
}

export function getCustomProgrammes(): string[] {
  return customProgrammes;
}

export function saveCustomProgrammes(list: string[]) {
  customProgrammes = list;
  localStorage.setItem("tnu_custom_programmes", JSON.stringify(list));
  persistSettings({ customProgrammes: list });
}

export function getHiddenProgrammes(): string[] {
  return hiddenProgrammes;
}

export function saveHiddenProgrammes(hidden: string[]) {
  hiddenProgrammes = hidden;
  localStorage.setItem("tnu_hidden_programmes", JSON.stringify(hidden));
  persistSettings({ hiddenProgrammes: hidden });
}

// ── Levels ─────────────────────────────────────────────

export function getLevels(): string[] {
  const custom = getCustomLevels();
  const hidden = getHiddenLevels();
  return [...LEVELS, ...custom]
    .filter((l) => !hidden.includes(l))
    .filter((l, i, arr) => arr.indexOf(l) === i);
}

export function getCustomLevels(): string[] {
  return customLevels;
}

export function saveCustomLevels(list: string[]) {
  customLevels = list;
  localStorage.setItem("tnu_custom_levels", JSON.stringify(list));
  persistSettings({ customLevels: list });
}

export function getHiddenLevels(): string[] {
  return hiddenLevels;
}

export function saveHiddenLevels(hidden: string[]) {
  hiddenLevels = hidden;
  localStorage.setItem("tnu_hidden_levels", JSON.stringify(hidden));
  persistSettings({ hiddenLevels: hidden });
}
