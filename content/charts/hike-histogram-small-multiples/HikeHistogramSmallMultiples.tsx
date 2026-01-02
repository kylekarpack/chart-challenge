"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import data from "../hike-histogram/data.json";

const enrichedData = data.map((hike) => ({
  ...hike,
  distanceInMiles: hike.distance / 1000 / 1.60934,
  ascent: hike.ascent * 3.28084,
  timeInHours: hike.time / 3600,
  date: new Date(hike.date),
  month: new Date(hike.date).getMonth() + 1,
  year: new Date(hike.date).getFullYear().toString(),
}));

const Histogram = ({
  title,
  bucketBy,
  bucketByLabel,
}: {
  title: string;
  bucketBy: string;
  bucketByLabel: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enrichedData === undefined) return;
    const plot = Plot.plot({
      title: title,
      width: 1200,
      height: 200,
      facet: {
        data: enrichedData,
        x: "year",
      },
      x: {},
      y: {
        type: "sqrt",
        grid: true,
      },
      marks: [
        Plot.rectY(enrichedData, Plot.binX({ y: "count" }, { x: bucketBy })),
        Plot.axisX({
          anchor: "bottom",
          label: bucketByLabel,
          tickSpacing: 20,
          tickFormat: "~s",
        }),
        Plot.axisY({ anchor: "left", label: "Count" }),
        Plot.frame({ strokeWidth: 0.5 }),
      ],
      fx: { label: "Year" },
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
      height: 400,
      marginLeft: 60,
      facet: {
        data: enrichedData,
        x: "year",
      },
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
        Plot.frame({ strokeWidth: 0.5 }),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

const ScatterPlotSingle = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      width: 1000,
      height: 550,
      marginLeft: 60,
      marginTop: 40,
      y: {
        grid: true,
        type: "sqrt",
      },
      x: {
        grid: true,
        type: "time",
      },
      color: {
        scheme: "Viridis",
        legend: true,
        label: "Ascent (feet)",
      },
      marks: [
        Plot.circle(enrichedData, {
          x: "date",
          y: "distanceInMiles",
          fill: "ascent",
          fillOpacity: 0.75,
          r: "ascent",
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
        Plot.axisX({ anchor: "bottom", label: "Date" }),
        Plot.axisY({ anchor: "left", label: "Distance (miles)" }),
        Plot.frame(),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

const MovingAverage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      color: { scheme: "BuRd" },
      marks: [
        Plot.ruleY([0]),
        Plot.areaY(
          enrichedData,
          Plot.windowY(
            {
              k: Infinity,
              reduce: "sum",
            },
            {
              x: "date",
              y: "distanceInMiles",
              curve: "basis",
            }
          )
        ),
        // Plot.lineY(
        //   enrichedData,
        //   Plot.windowY(
        //     {
        //       k: Infinity,
        //       reduce: "sum",
        //     },
        //     {
        //       x: "date",
        //       y: "ascent",
        //       curve: "basis",
        //     }
        //   )
        // ),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export const HikeHistogramSmallMultiples = () => {
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
      <div className="mt-8 mb-4">
        This is probably my favorite chart in this edition. It makes it easy to
        see what the longest/hardest hikes were each year, and makes comparing
        years easy to do at a glance.
      </div>
      <ScatterPlot />

      <div className="mt-8 mb-4">
        But it might also just be better as a single plot:
      </div>
      <ScatterPlotSingle />

      <div className="mt-8 mb-4">Moving average:</div>
      <MovingAverage />
    </div>
  );
};
