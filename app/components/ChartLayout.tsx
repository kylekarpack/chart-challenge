type Metadata = {
  title: string;
  description: string;
  date: string;
};

export default function ChartLayout({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata: Metadata;
}) {
  return (
    <header className="chart-header">
      <h1>{metadata.title}</h1>
      <p>{metadata.description}</p>
      <p className="chart-date">Date: {metadata.date}</p>
      <div className="chart-page">
        <div className="chart-container">{children}</div>
      </div>
    </header>
  );
}
