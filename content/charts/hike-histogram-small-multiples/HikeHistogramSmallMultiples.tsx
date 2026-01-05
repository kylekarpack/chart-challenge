"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import data from "../hike-histogram/data.json";
import Link from "next/link";

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

const Waffle = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState<"x" | "z">("x");

  useEffect(() => {
    if (enrichedData === undefined) return;

    console.log("setting to", sortBy);
    const plot = Plot.plot({
      width: 1200,
      height: 450,
      marginBottom: 50,
      x: {
        label: null,
        tickFormat: " ",
        tickSpacing: Infinity,
        type: "band",
      },
      y: {
        grid: true,
      },
      color: {
        scheme: "Viridis",
        legend: true,
        label: "Distance (miles)",
        type: "sqrt",
      },
      marks: [
        Plot.waffleY(enrichedData, {
          ...Plot.binX(
            { y: "count", fill: "z", sort: sortBy },
            {
              x: "date",
              z: "distanceInMiles",
            }
          ),
          tip: {
            format: {
              y: false,
              fill: false,
              Trail: true,
              Distance: (d) => `${d.toFixed(1)} miles`,
              Elevation: (d) => `${d.toFixed(0)} ft`,
              Time: (d) => `${d.toFixed(1)} hrs`,
            },
            channels: {
              Trail: "title",
              Distance: "distanceInMiles",
              Elevation: "ascent",
              Time: "timeInHours",
            },
          },
        }),
        Plot.axisY({ anchor: "left", label: "Count" }),
        Plot.axisX({
          anchor: "bottom",
          label: "Date",
          tickFormat: "%Y",
          labelOffset: 40,
        }),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, [sortBy]);

  return (
    <div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as "x" | "z")}
        className="mb-4 border border-gray-300 rounded-md py-1 px-2"
      >
        <option value="x">Sort by Date</option>
        <option value="z">Sort by Distance</option>
      </select>
      <div ref={containerRef} />
    </div>
  );
};

const ScatterPlot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      width: 1200,
      height: 450,
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
      width: 1200,
      height: 550,
      marginLeft: 25,
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

const CumulativeTotal = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      width: 1200,
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
              cumulative: true,
              tip: {
                format: {
                  x: (d) => new Date(d).toLocaleDateString(),
                  y: (d) => `${d.toFixed(1)} cumulative miles`,
                },
              },
            }
          )
        ),
        Plot.axisY({ anchor: "left", label: "Cumulative Distance (miles)" }),
        Plot.axisX({ anchor: "bottom", label: "Year" }),
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Facets</h1>
      <p className="mb-4">
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          href="https://observablehq.com/plot/features/facets"
        >
          Facets
        </Link>{" "}
        producing{" "}
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          href="https://en.wikipedia.org/wiki/Small_multiple"
        >
          small multiple charts
        </Link>{" "}
        were a fun one to start with. Faceting by year probably doesn&apos;t
        make the most sense, but I didn&apos;t have any other categories in this
        data.
      </p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
        Faceted Scatterplot
      </h1>
      <p className="mb-4">
        This is probably my favorite chart in this edition. It makes it easy to
        see what the longest/hardest hikes were each year, and makes comparing
        years easy to do at a glance.
      </p>
      <ScatterPlot />
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
        Single Scatterplot
      </h1>
      <p className="mb-4">But it might also just be better as a single plot:</p>
      <ScatterPlotSingle />
      <h1 className="text-xl font-bold text-gray-900 mb-4 mt-10">
        Waffle Plot
      </h1>
      <p className="mb-4">How about a waffle plot?</p>
      <Waffle />
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-10">
        Cumulative Total
      </h1>

      <p className="mb-4">
        Cumulative total of hiking miles using{" "}
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          href="https://observablehq.com/plot/transforms/window#window-transform"
        >
          window transforms
        </Link>
        :
      </p>
      <CumulativeTotal />
    </div>
  );
};
