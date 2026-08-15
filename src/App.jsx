import { useState } from "react";
import Catalog from "./pages/Catalog";
import Circulation from "./pages/Circulation";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("catalog");

  return (
    <div id="app">
      <header className="header">
        <h1>
          <span className="header-icon">📚</span>
          Library Management System
        </h1>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeSection === "catalog" ? "active" : ""}`}
          onClick={() => setActiveSection("catalog")}
        >
          📖 Book Catalog
        </button>
        <button
          className={`nav-tab ${activeSection === "circulation" ? "active" : ""}`}
          onClick={() => setActiveSection("circulation")}
        >
          🔄 Circulation
        </button>
      </nav>

      <main className="content">
        <section className={`section ${activeSection === "catalog" ? "active" : ""}`}>
          <Catalog />
        </section>

        <section className={`section ${activeSection === "circulation" ? "active" : ""}`}>
          <Circulation />
        </section>
      </main>
    </div>
  );
}

export default App;