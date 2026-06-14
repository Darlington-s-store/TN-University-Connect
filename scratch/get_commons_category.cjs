const https = require("https");

function fetchJson(url) {
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
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

async function run() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:University_of_Cape_Coast&cmlimit=500&format=json`;
  try {
    const res = await fetchJson(url);
    const members = res.query.categorymembers;
    console.log("Files/Subcats in Category:University_of_Cape_Coast:");
    for (const member of members) {
      console.log(`  * [${member.ns === 6 ? "FILE" : "OTHER"}] ${member.title}`);
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
