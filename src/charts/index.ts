// Chart Registry
// Add new charts here to make them available in the application

import { INaturalistSunburst } from './2026-12-06'

export interface ChartInfo {
  date: string
  title: string
  description?: string
  component: React.ComponentType
}

export const charts: ChartInfo[] = [
  {
    date: '2026-12-06',
    title: 'iNaturalist Observations',
    description: 'A sunburst chart showing taxonomic distribution of observations',
    component: INaturalistSunburst,
  },
  // Add more charts here as you create them
  // Example:
  // {
  //   date: '2026-12-13',
  //   title: 'My New Chart',
  //   description: 'Description of the chart',
  //   component: MyNewChart,
  // },
]

export const chartsByDate = charts.reduce((acc, chart) => {
  acc[chart.date] = chart
  return acc
}, {} as Record<string, ChartInfo>)

