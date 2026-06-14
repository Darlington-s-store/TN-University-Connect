const https = require("https");

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    };
    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function run() {
  console.log("Fetching UCC Wikipedia page HTML...");
  const html = await fetchHtml("https://en.wikipedia.org/wiki/University_of_Cape_Coast");

  // Search for images in the HTML, especially in the infobox
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;
  console.log("Found images on page:");
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (
      src.includes("logo") ||
      src.includes("crest") ||
      src.includes("emblem") ||
      src.includes("seal") ||
      src.includes("Cape") ||
      src.includes("UCC")
    ) {
      console.log(`  * ${src}`);
    }
  }

  console.log("\nSearching for infobox table rows...");
  const infoboxMatch = html.match(/<table class="infobox[^"]*">([\s\S]*?)<\/table>/);
  if (infoboxMatch) {
    const infoboxHtml = infoboxMatch[1];
    const infoboxImages = [];
    let imgMatch;
    while ((imgMatch = imgRegex.exec(infoboxHtml)) !== null) {
      infoboxImages.push(imgMatch[1]);
    }
    console.log("Images in infobox:", infoboxImages);
  } else {
    console.log("No infobox found!");
  }
}

run();
