import { INaturalistSunburst } from ".";

export const metadata = {
  title: "iNaturalist Observations",
  description: "A sunburst chart showing taxonomic distribution of the iNaturalist observations that I made in 2025",
  date: "2026-12-16",
};

export default function Page() {
  return (
    <div className="chart-page">
      <header className="chart-header">
        <h1>{metadata.title}</h1>
        <p>{metadata.description}</p>
        <p className="chart-date">Date: {metadata.date}</p>
      </header>
      <div className="chart-container">
        <INaturalistSunburst />
      </div>
    </div>
  );
}

