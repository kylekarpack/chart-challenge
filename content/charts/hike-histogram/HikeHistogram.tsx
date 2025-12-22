"use client";

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
