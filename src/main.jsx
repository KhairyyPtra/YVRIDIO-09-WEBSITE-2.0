import "./styles/global.css";
import "./styles/icons.css";
import "./styles/plain.css";
import "./legacy/LegacyRuntime.jsx";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootElement = document.getElementById("react-root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
  document.documentElement.classList.add("app-ready");
}