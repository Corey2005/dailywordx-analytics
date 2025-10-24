import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/dailywordx-analytics/index.html';
  } else {
    // No self-redirect - serve static content or redirect to React app
    // For now, just display a message (replace with actual dashboard later)
    document.getElementById('root').innerHTML = '<h1>Welcome to DailyWordX Dashboard!</h1>';
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
