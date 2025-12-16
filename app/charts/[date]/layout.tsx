'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { charts } from '@/charts'
import './chart-layout.css'

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentChart = pathname.split('/').pop()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-content">
          <Link href="/" className="sidebar-title-link">
            <h2>Chart Challenge</h2>
          </Link>
          <nav>
            <h3>Charts</h3>
            <ul>
              {charts.map((chart) => (
                <li 
                  key={chart.date}
                  className={currentChart === chart.date ? 'active' : ''}
                >
                  <Link href={`/charts/${chart.date}`}>
                    {chart.date}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {currentChart && (
            <div className="sidebar-info">
              <p>Currently viewing: {currentChart}</p>
            </div>
          )}
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

