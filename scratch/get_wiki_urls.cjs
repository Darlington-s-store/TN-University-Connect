const https = require("https");

const files = [
  "File:Knust seal.jpg",
  "File:University of Cape Coast crest.png", // Let's check if this is the name
  "File:University of Education, Winneba logo.jpg",
  "File:Ashesi University logo.png",
  "File:Central University (Ghana).jpg",
  "File:Ho Technical University logo.png",
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "TN-Universities-Connect-Bot/1.0 (https://github.com/Darlington-s-store/TN-University-Connect; support@example.com)",
      },
    };
    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function getImageUrl(fileName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetchJson(url);
    const pages = res.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") {
      // Not found on English Wikipedia, let's try Wikimedia Commons API
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
      const commonsRes = await fetchJson(commonsUrl);
      const commonsPages = commonsRes.query.pages;
      const commonsPageId = Object.keys(commonsPages)[0];
      if (commonsPageId === "-1") {
        return null;
      }
      return commonsPages[commonsPageId].imageinfo[0].url;
    }
    return pages[pageId].imageinfo[0].url;
  } catch (e) {
    console.error(`Error fetching image for ${fileName}:`, e.message);
    return null;
  }
}

async function getInfoboxImage(pageName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageName)}&prop=images&format=json`;
  try {
    const res = await fetchJson(url);
    const pages = res.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    return pages[pageId].images || [];
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log("--- FETCHING FILE URLS DIRECTLY VIA WIKIPEDIA/COMMONS API ---");
  for (const file of files) {
    const url = await getImageUrl(file);
    if (url) {
      console.log(`[FOUND] ${file} -> ${url}`);
    } else {
      console.log(`[NOT FOUND] ${file}`);
    }
  }

  console.log("\n--- SEARCHING FOR ALTERNATIVES BY PARSING WIKIPEDIA PAGE IMAGES ---");
  const pagesToSearch = [
    "Kwame Nkrumah University of Science and Technology",
    "University of Cape Coast",
    "University of Education, Winneba",
    "Ashesi University",
    "Central University (Ghana)",
    "Ho Technical University",
  ];

  for (const page of pagesToSearch) {
    console.log(`\nImages on page: "${page}":`);
    const images = await getInfoboxImage(page);
    if (images && images.length > 0) {
      for (const img of images) {
        if (
          img.title.toLowerCase().includes("logo") ||
          img.title.toLowerCase().includes("seal") ||
          img.title.toLowerCase().includes("crest") ||
          img.title.toLowerCase().includes("shield") ||
          img.title.toLowerCase().includes("emblem") ||
          img.title.toLowerCase().includes("university")
        ) {
          const url = await getImageUrl(img.title);
          console.log(`  * ${img.title} -> ${url}`);
        }
      }
    } else {
      console.log("  No images found or page does not exist.");
    }
  }
}

run();
