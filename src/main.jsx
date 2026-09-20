import "./styles/global.css";
import "./styles/theme.css";
import "./styles/icons.css";
import "./legacy/LegacyRuntime.jsx";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/plain.css";

const rootElement = document.getElementById("react-root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
  document.documentElement.classList.add("app-ready");
}