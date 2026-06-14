const https = require("https");

const urls = {
  UG: "https://upload.wikimedia.org/wikipedia/commons/6/64/University_of_Ghana.png",
  KNUST: "https://upload.wikimedia.org/wikipedia/commons/f/f5/KNUST.png",
  UCC: "https://upload.wikimedia.org/wikipedia/commons/1/15/UCC_logo.png",
  UEW: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_of_the_University_of_Education%2C_Winneba.png",
  UDS: "https://uds.edu.gh/images/uds_emblem.png",
  GIMPA:
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/GIMPA_%28Ghana_Institute_of_Management_and_Public_Administration%29_logo.jpg",
  Ashesi: "https://upload.wikimedia.org/wikipedia/commons/8/81/Ashesi_University_Logo.png",
  Central: "https://central.edu.gh/virgin/images/Central-Uni-logo.png",
  UPSA: "https://upsa.edu.gh/wp-content/uploads/2020/11/upsa-logoacbsp.png",
  HTU: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Ho_Technical_University_logo.png/240px-Ho_Technical_University_logo.png",
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
  console.log("Testing URLs...");
  for (const [name, url] of Object.entries(urls)) {
    const result = await testUrl(name, url);
    if (result.status === 200) {
      console.log(`[OK] ${name}: ${url}`);
    } else {
      console.log(`[FAIL] ${name} (Status: ${result.status}): ${url} ${result.error || ""}`);
    }
  }
}

run();
