import React, { useState } from "react";
import "./App.css";
import { INaturalistSunburst } from "./charts/2026-12-06";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Chart Challenge</h1>
        Currently on chart: 2026-12-16
      </header>
      <div className="chart-container">
        <INaturalistSunburst />
      </div>
    </div>
  );
};

export default App;
