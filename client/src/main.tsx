import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";
import { HelmetProvider } from "react-helmet-async";

// Initialize Google Analytics
initGA();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
