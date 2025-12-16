'use client'

import Link from 'next/link'
import { charts } from '@/charts'
import './page.css'

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1>Chart Challenge</h1>
          <p>A personal challenge to create and explore new data visualizations regularly</p>
        </header>

        <section className="charts-grid">
          <h2>Available Charts</h2>
          <div className="chart-cards">
            {charts.map((chart) => (
              <Link 
                key={chart.date} 
                href={`/charts/${chart.date}`}
                className="chart-card"
              >
                <div className="chart-card-date">{chart.date}</div>
                <h3>{chart.title}</h3>
                <p>{chart.description}</p>
                <span className="chart-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-info">
          <h2>About</h2>
          <p>
            This project is a collection of data visualizations created using modern web technologies.
            Each chart explores different datasets and visualization techniques.
          </p>
        </section>
      </div>
    </div>
  )
}

