const https = require("https");

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      rejectUnauthorized: false,
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
  const urls = ["https://elearning.ucc.edu.gh", "https://portal.ucc.edu.gh"];
  for (const url of urls) {
    try {
      console.log(`\nFetching ${url} HTML...`);
      const html = await fetchHtml(url);
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      let match;
      console.log(`Images found on ${url}:`);
      while ((match = imgRegex.exec(html)) !== null) {
        console.log(`  * ${match[1]}`);
      }
    } catch (e) {
      console.error(`Error scraping ${url}:`, e.message);
    }
  }
}

run();
