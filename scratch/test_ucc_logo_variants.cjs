const https = require("https");

const candidates = [
  "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/coloured-horizontal-logo/ucclogo_horizontal.png",
  "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/ucclogo_horizontal_coloured.png",
  "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/ucclogo_horizontal_color.png",
  "https://ucc.edu.gh/img/ucc-logos/crest/ucc_crest.png",
  "https://ucc.edu.gh/img/ucc-logos/crest/crest.png",
  "https://ucc.edu.gh/img/ucc-logos/logo.png",
  "https://ucc.edu.gh/img/ucc-logos/ucclogo.png",
  "https://ucc.edu.gh/img/ucc-logos/crest/ucclogo_crest.png",
  "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/color-horizontal-logo/ucclogo_horizontal_color.png",
  "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/coloured-horizontal-logo/ucclogo_horizontal_coloured.png",
];

function testUrl(url) {
  return new Promise((resolve) => {
    const options = {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      rejectUnauthorized: false,
    };
    const req = https.request(url, options, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on("error", (err) => {
      resolve({ url, status: "ERROR", error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log("Testing UCC variants...");
  for (const url of candidates) {
    const res = await testUrl(url);
    if (res.status === 200) {
      console.log(`[OK] Found: ${url}`);
    } else {
      console.log(`[FAIL] (${res.status}): ${url}`);
    }
  }
}

run();
