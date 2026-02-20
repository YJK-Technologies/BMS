// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const cors = require("cors");
// const https = require("https");
// const http = require("http"); // Import HTTP module
// const dataRoutes = require("./routes/dataRoutes");
// const app = express();


// const HTTPS_PORT = 5505; // HTTPS server port

// // SSL options for HTTPS
// const sslOptions = {
//   key: fs.readFileSync(path.resolve("C:/Utils/Certificates/STAR_yjktechnologies_com", "STAR.yjktechnologies.com_key.txt")),
//   cert: fs.readFileSync(path.resolve("C:/Utils/Certificates/STAR_yjktechnologies_com", "STAR_yjktechnologies_com.crt")),
//   ca: fs.readFileSync(path.resolve("C:/Utils/Certificates/STAR_yjktechnologies_com", "STAR_yjktechnologies_com.ca-bundle")),
// };

// app.use(cors());
// app.use(express.json({limit:'10mb'}));

// // Middleware
// app.use("/", dataRoutes);

// app.get("/", (req, res) => {
//     res.send("Welcome to the home page!");
// });

// // Create HTTP server
// // Create HTTPS server
// https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
//     console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
//   });



const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const path = require("path");
const dataRoutes = require("./routes/dataRoutes");
const frontendErrorRoutes  = require("./routes/frontendErrorRoutes");

const app = express();
const PORT = 5502;

// SSL certificate folder
const CERT_FOLDER = "C:/Utils/Certificates/STAR.yjktechnologies.com_cert_Nov2025";

// Load SSL certs once
let sslOptions = {
  key: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com_key.key")),
  cert: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com.crt")),
  ca: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com.ca-bundle")),
};

// Auto reload certs if updated (no restart needed)
fs.watchFile(path.join(CERT_FOLDER, "STAR.yjktechnologies.com.crt"), () => {
  console.log("🔄 SSL certificate changed, reloading...");
  sslOptions = {
    key: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com_key.key")),
    cert: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com.crt")),
    ca: fs.readFileSync(path.join(CERT_FOLDER, "STAR.yjktechnologies.com.ca-bundle")),
  };
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/", dataRoutes);

// Frontend error logging route
app.use("/api", frontendErrorRoutes);

// Create HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
});

