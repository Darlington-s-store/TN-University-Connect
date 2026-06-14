const https = require("https");

const urls = {
  UG: "https://upload.wikimedia.org/wikipedia/commons/6/64/University_of_Ghana.png",
  KNUST: "https://upload.wikimedia.org/wikipedia/en/b/b4/Knust_seal.jpg",
  UCC: "https://ucc.edu.gh/img/ucc-logos/horizontal-logo/white-horizontal-logo/ucclogo_horizontal_white.png",
  UEW: "https://upload.wikimedia.org/wikipedia/en/0/08/University_of_Education%2C_Winneba_logo.jpg",
  UDS: "https://uds.edu.gh/images/uds_emblem.png",
  GIMPA:
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/GIMPA_%28Ghana_Institute_of_Management_and_Public_Administration%29_logo.jpg",
  Ashesi: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ashesi_University_Logo.png",
  Central: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Central_University_%28Ghana%29.jpg",
  UPSA: "https://upsa.edu.gh/wp-content/uploads/2020/11/upsa-logoacbsp.png",
  HTU: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Ho_Polytechnic_Logo.jpg",
};

function testUrl(name, url) {
  return new Promise((resolve) => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      rejectUnauthorized: false,
    };
    const req = https.request(url, options, (res) => {
      resolve({ name, url, status: res.statusCode });
    });
    req.on("error", (err) => {
      resolve({ name, url, status: "ERROR", error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log("Testing Final URLs...");
  for (const [name, url] of Object.entries(urls)) {
    const result = await testUrl(name, url);
    if (result.status === 200 || result.status === 302 || result.status === 429) {
      console.log(`[OK] ${name}: ${url} (Status: ${result.status})`);
    } else {
      console.log(`[FAIL] ${name}: ${url} (Status: ${result.status})`);
    }
  }
}

run();
