'use client'

import React from "react"
import { INaturalistSunburst } from "@/charts/2026-12-06"

// You can add more chart imports here as you create them
const charts = {
  "2026-12-06": INaturalistSunburst,
}

export default function Home() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-content">
          <h2>Chart Challenge</h2>
          <nav>
            <h3>Charts</h3>
            <ul>
              {Object.entries(charts).map(([key, _value]) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-info">
            <p>Currently viewing: 2026-12-06</p>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="app-header">
          <h1>iNaturalist Observations</h1>
        </header>
        <div className="chart-container">
          <INaturalistSunburst />
        </div>
      </main>
    </div>
  )
}

