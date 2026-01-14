import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginApp from "./Login.jsx";
import SignupApp from "./Signup.jsx";
import "./Login.css";
import "./Signup.css";

function App() {
  const [view, setView] = useState("login");

  if (view === "signup") {
    return <SignupApp onBack={() => setView("login")} />;
  }

  return <LoginApp onSignup={() => setView("signup")} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
