import BetterColorScalesPage from "@/content/charts/better-color-scales/BetterColorScales";
import DatabenchPage from "@/content/charts/databench/Databench";
import HikeHistogramSmallMultiplesPage from "@/content/charts/hike-histogram-small-multiples/HikeHistogramSmallMultiples";
import HikeHistogramPage from "@/content/charts/hike-histogram/HikeHistogram";
import INaturalistSunburstPage from "@/content/charts/inaturalist-sunburst/INaturalistSunburst";
import MuchDataPage from "@/content/charts/much-data/MuchData";
import RacingPage from "@/content/charts/racing/Racing";
import TideChartsPage from "@/content/charts/tide-charts/TideCharts";
import TuckedTicksPage from "@/content/charts/tucked-ticks/TuckedTicks";
import type { ComponentType } from "react";

export interface Chart {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  PageContent: ComponentType;
}

export type ChartMeta = Omit<Chart, "PageContent">;

const chartList: Chart[] = [
  {
    slug: "databench",
    title: "Databench",
    publishedAt: "2026-02-17",
    summary: "Benchmark some data processing options",
    PageContent: DatabenchPage,
  },
  {
    slug: "better-color-scales",
    title: "Better Color Scales",
    publishedAt: "2026-02-12",
    summary: "Better color scales than ever before!",
    PageContent: BetterColorScalesPage,
  },
  {
    slug: "tucked-ticks",
    title: "Tucked Ticks",
    publishedAt: "2026-01-29",
    summary: "Axes with tick marks tucked away.",
    PageContent: TuckedTicksPage,
  },
  {
    slug: "racing",
    title: "Bundesliga Race",
    publishedAt: "2026-01-24",
    summary: "Visualizing Bundesliga goals scored over time.",
    PageContent: RacingPage,
  },
  {
    slug: "tide-charts",
    title: "Tide Charts",
    publishedAt: "2026-01-15",
    summary: "Visualizing tidal data.",
    PageContent: TideChartsPage,
  },
  {
    slug: "hike-histogram-small-multiples",
    title: "Hiking Visualizations with Observable Plot Features",
    publishedAt: "2026-01-01",
    summary:
      "Various hiking metrics visualized using a variety of different features in Observable Plot.",
    PageContent: HikeHistogramSmallMultiplesPage,
  },
  {
    slug: "much-data",
    title: "Working With Large Datasets",
    publishedAt: "2026-01-08",
    summary: "A test of how different libraries handle large datasets.",
    PageContent: MuchDataPage,
  },
  {
    slug: "inaturalist-sunburst",
    title: "iNaturalist Sunburst",
    publishedAt: "2025-12-16",
    summary: "A sunburst chart of my iNaturalist observations in 2025.",
    PageContent: INaturalistSunburstPage,
  },
  {
    slug: "hike-histogram",
    title: "Hiking Histograms",
    publishedAt: "2025-12-22",
    summary: "Histograms of various hiking metrics.",
    PageContent: HikeHistogramPage,
  }
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getAllCharts(): ChartMeta[] {
  return chartList.map(({ PageContent: _, ...rest }) => rest);
}

export function getChartBySlug(slug: string): Chart | null {
  return chartList.find((c) => c.slug === slug) ?? null;
}
