import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/AuthProvider";
import { BudgetProvider } from "./hooks/BudgetProvider";
import "./index.css";

// Hide preloader once React is ready
const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <AuthProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </AuthProvider>
  </StrictMode>,
);

// Hide preloader
requestAnimationFrame(() =>
  requestAnimationFrame(() => (window as any).__hidePreloader?.()),
);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.log("SW registration failed:", err));
  });
}
