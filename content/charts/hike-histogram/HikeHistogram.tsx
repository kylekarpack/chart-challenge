"use client";

import Link from "next/link";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import data from "./data.json";

const enrichedData = data.map((hike) => ({
  ...hike,
  distanceInMiles: hike.distance / 1000 / 1.60934,
  ascent: hike.ascent * 3.28084,
  timeInHours: hike.time / 3600,
  date: new Date(hike.date),
}));

const Histogram = ({
  bucketBy,
  bucketByLabel,
  xAxisType = "linear",
  yAxisType = "sqrt",
  title = "",
  extraMarks = [],
}: {
  bucketBy: keyof (typeof enrichedData)[0];
  bucketByLabel: string;
  xAxisType?: Plot.ScaleType;
  yAxisType?: Plot.ScaleType;
  title?: string;
  extraMarks?: Plot.Mark[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      title: title,
      width: 1000,
      height: 250,
      y: {
        grid: true,
        type: yAxisType,
      },
      x: {
        type: xAxisType,
      },
      marks: [
        Plot.rectY(enrichedData, Plot.binX({ y: "count" }, { x: bucketBy })),
        Plot.axisX({ anchor: "bottom", label: bucketByLabel }),
        Plot.axisY({ anchor: "left", label: "Count" }),
        Plot.ruleY([0]),
        ...(extraMarks as any[]),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

const ScatterPlot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      width: 1000,
      height: 500,
      marginLeft: 60,
      y: {
        grid: true,
        type: "sqrt",
      },
      x: {
        type: "sqrt",
      },
      color: {
        scheme: "Viridis",
        legend: true,
        label: "Time (hours)",
      },
      marks: [
        Plot.circle(enrichedData, {
          x: "distanceInMiles",
          y: "ascent",
          fill: "timeInHours",
          fillOpacity: 0.75,
          r: "timeInHours",
          stroke: "rgba(0, 0, 0, 0.4)",
          tip: {
            format: {
              x: false,
              y: false,
              fill: false,
              r: false,
              Trail: true,
              Distance: (d) => `${d.toFixed(1)} miles`,
              Elevation: (d) => `${d.toFixed(0)} ft`,
              Time: (d) => `${d.toFixed(1)} hrs`,
            },
          },
          channels: {
            Trail: "title",
            Time: "timeInHours",
            Distance: "distanceInMiles",
            Elevation: "ascent",
          },
        }),
        Plot.axisX({ anchor: "bottom", label: "Distance (miles)" }),
        Plot.axisY({ anchor: "left", label: "Elevation (feet)" }),
        Plot.ruleY([0]),
        Plot.ruleX([0]),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export const HikeHistogram = () => {
  return (
    <div>
      <Histogram
        title="Hikes by Distance"
        bucketBy="distanceInMiles"
        bucketByLabel="Distance (miles)"
      />
      <Histogram
        title="Hikes by Ascent"
        bucketBy="ascent"
        bucketByLabel="Ascent (feet)"
      />
      <Histogram
        title="Hikes by Time"
        bucketBy="timeInHours"
        bucketByLabel="Time (hours)"
      />
      <Histogram
        title="Hikes by Year"
        bucketBy="date"
        bucketByLabel="Year"
        xAxisType="time"
        yAxisType="linear"
        extraMarks={[
          Plot.tip(
            ["I had a baby this year and it definitely impacted my hiking!"],
            {
              x: new Date("2024-07-07"),
              dy: 20,
              anchor: "bottom",
            }
          ),
        ]}
      />
      <div className="mt-8 mb-4">
        Bonus! Scatter plot of distance vs. elevation.
      </div>
      <ScatterPlot />
    </div>
  );
};

export default function HikeHistogramPage() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        I&apos;ve been hiking a fair bit this decade, and I&apos;ve been
        tracking my hikes with Gaia GPS. Curious to see some stats on my hikes,
        I created some histograms to visualize various metrics.
      </p>
      <p className="text-base leading-7 mb-4 text-gray-700">
        All charts are made with{" "}
        <Link
          href="https://observablehq.com/plot"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Observable Plot
        </Link>
        .
      </p>
      <div className="min-h-[800px] w-full mt-12">
        <HikeHistogram />
      </div>
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
        Things I learned:
      </h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">
          Axis scale for histograms can be tricky, especially when data
          doesn&apos;t follow a normal distribution
        </li>
        <li className="pl-2 pt-2">Most of my hikes were pretty easy!</li>
        <li className="pl-2 pt-2">
          Charts made in Observable Plot look really nice out-of-the-box
        </li>
      </ul>
    </>
  );
}
