const fs = require("fs");
const path = require("path");

// ---> Change this to your desired drive/path
const LOG_BASE_PATH = "E:/YJK FILES/BMS_Error_Log";  

/**
 * Save error log with user + SP info
 * @param {object} logData { user, spName, errorMessage }
 */
function saveErrorLog({ user, spName, errorMessage }) {
  try {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // Example: D:/BMS_Logs/2025/08
    const basePath = path.join(LOG_BASE_PATH, year, month);
    fs.mkdirSync(basePath, { recursive: true });

    // Example: D:/BMS_Logs/2025/08/18.txt
    const filePath = path.join(basePath, `${day}.txt`);

    // Log format with timestamp + user + sp + error
    const logMessage = `[${now.toISOString()}] User: ${user || "Unknown"} | SP: ${
      spName || "N/A"
    } | Error: ${errorMessage}\n`;

    fs.appendFileSync(filePath, logMessage, "utf8");
  } catch (err) {
    console.error("Error while saving log:", err);
  }
}

module.exports = saveErrorLog;
