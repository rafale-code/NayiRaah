import React from "react";
import ReactDOM from "react-dom/client";
import SaathiApp from "./Final"; // ✅ import your big component

import "./index.css"; // keep styles

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SaathiApp /> {/* ✅ renders your component */}
  </React.StrictMode>
);
