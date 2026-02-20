// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
const config = require("./ApiConfig");

// ✅ Global error capture for frontend
window.addEventListener("error", function (event) {
  fetch(`${config.apiBaseUrl}/api/log-frontend-error`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: sessionStorage.getItem("selectedUserCode") || "Guest",
      page: window.location.pathname,
      errorMessage: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
    }),
  }).catch((err) => console.error("Failed to send frontend error:", err));
});

window.addEventListener("unhandledrejection", function (event) {
  fetch(`${config.apiBaseUrl}/api/log-frontend-error`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: sessionStorage.getItem("selectedUserCode") || "Guest",
      page: window.location.pathname,
      errorMessage: event.reason?.toString() || "Unhandled promise rejection",
    }),
  }).catch((err) => console.error("Failed to send frontend rejection:", err));
});
// ✅ End of global error capture

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
