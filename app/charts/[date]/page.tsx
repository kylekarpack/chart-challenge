import { notFound } from 'next/navigation'
import { chartsByDate, charts } from '@/charts'

// Generate static params for all available charts
export async function generateStaticParams() {
  return charts.map((chart) => ({
    date: chart.date,
  }))
}

// Generate metadata for each chart
export async function generateMetadata({ params }: { params: { date: string } }) {
  const chart = chartsByDate[params.date]
  
  if (!chart) {
    return {
      title: 'Chart Not Found',
    }
  }

  return {
    title: `${chart.title} - Chart Challenge`,
    description: chart.description,
  }
}

export default function ChartPage({ params }: { params: { date: string } }) {
  const chart = chartsByDate[params.date]

  if (!chart) {
    notFound()
  }

  const ChartComponent = chart.component

  return (
    <div className="chart-page">
      <header className="chart-header">
        <h1>{chart.title}</h1>
        {chart.description && <p>{chart.description}</p>}
        <p className="chart-date">Date: {params.date}</p>
      </header>
      <div className="chart-container">
        <ChartComponent />
      </div>
    </div>
  )
}

