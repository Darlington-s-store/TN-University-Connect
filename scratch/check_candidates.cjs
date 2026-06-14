const https = require("https");

const candidates = {
  KNUST_seal: "https://upload.wikimedia.org/wikipedia/en/b/b5/Knust_seal.jpg",
  KNUST_commons: "https://upload.wikimedia.org/wikipedia/commons/f/f5/KNUST.png",
  UCC_website: "https://ucc.edu.gh/sites/default/files/ucc_logo_0.png",
  UCC_theme: "https://ucc.edu.gh/themes/ucc/logo.png",
  UCC_crest:
    "https://upload.wikimedia.org/wikipedia/commons/e/e1/University_of_Cape_Coast_crest.png",
  UEW_jpg:
    "https://upload.wikimedia.org/wikipedia/commons/b/b6/University_of_Education%2C_Winneba_logo.jpg",
  UEW_png_alt:
    "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_of_the_University_of_Education_Winneba.png",
  Ashesi_lower: "https://upload.wikimedia.org/wikipedia/commons/8/81/Ashesi_University_logo.png",
  Ashesi_short: "https://upload.wikimedia.org/wikipedia/commons/8/81/Ashesi_logo.png",
  Central_wiki: "https://upload.wikimedia.org/wikipedia/en/1/14/Central_University_%28Ghana%29.jpg",
  HTU_full: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Ho_Technical_University_logo.png",
};

function testUrl(name, url) {
  return new Promise((resolve) => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    };
    const req = https.request(url, options, (res) => {
      resolve({ name, url, status: res.statusCode, headers: res.headers });
    });
    req.on("error", (err) => {
      resolve({ name, url, status: "ERROR", error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log("Testing Candidates...");
  for (const [name, url] of Object.entries(candidates)) {
    const result = await testUrl(name, url);
    if (result.status === 200) {
      console.log(`[OK] ${name}: ${url}`);
    } else {
      console.log(`[FAIL] ${name} (Status: ${result.status}): ${url}`);
    }
  }
}

run();
