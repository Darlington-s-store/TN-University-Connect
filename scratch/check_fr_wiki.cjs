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
  try {
    console.log("Fetching French Wikipedia UCC page HTML...");
    const html = await fetchHtml("https://fr.wikipedia.org/wiki/Universit%C3%A9_de_Cape_Coast");
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    let match;
    console.log("Images found on French Wikipedia UCC page:");
    while ((match = imgRegex.exec(html)) !== null) {
      console.log(`  * ${match[1]}`);
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
