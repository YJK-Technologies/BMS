// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to send index.html for any request that doesn't match a static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set port from environment or default to 5000
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
