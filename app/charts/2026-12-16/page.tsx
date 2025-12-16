import { INaturalistSunburst } from "./INaturalistSunburst";
import ChartLayout from "../../components/ChartLayout";

export default function Page() {
  return (
    <ChartLayout
      metadata={{
        title: "iNaturalist Observations",
        description:
          "A sunburst chart showing taxonomic distribution of the iNaturalist observations that I made in 2025",
        date: "2026-12-16",
      }}
    >
      <INaturalistSunburst />
    </ChartLayout>
  );
}
