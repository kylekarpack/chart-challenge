"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
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

const Waffle = ({ scaleType }: { scaleType?: "sqrt" | "linear" | "log" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState<"x" | "z">("x");

  useEffect(() => {
    if (enrichedData === undefined) return;

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
        type: scaleType,
        reverse: true
      },
      marks: [
		Plot.ruleY([0]),
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

export const BetterColorScales = () => {
  return (
    <div>
      <p className="mb-4 font-bold text-lg">Inverted color scale (sqrt)</p>
      <Waffle scaleType="sqrt" />
      <p className="mb-4 font-bold text-lg">Inverted color scale (linear)</p>
      <Waffle scaleType="linear" />
      <p className="mb-4 font-bold text-lg">Inverted color scale (log)</p>
      <Waffle scaleType="log" />
    </div>
  );
};
