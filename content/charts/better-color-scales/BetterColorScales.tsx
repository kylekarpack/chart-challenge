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

const Waffle = ({ scaleType, darkMode }: { scaleType?: "sqrt" | "linear" | "log", darkMode?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState<"x" | "z">("x");
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (enrichedData === undefined) return;

    const darkModeDefault = darkMode ? reverse : !reverse;

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
        reverse: darkModeDefault,
      },
      marks: [
        Plot.ruleY([0]),
        Plot.waffleY(enrichedData, {
          ...Plot.binX(
            { y: "count", fill: "z", sort: sortBy },
            {
              x: "date",
              z: "distanceInMiles",
            },
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
            className: darkMode ? "text-black" : "",
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
  }, [sortBy, reverse, darkMode]);

  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "x" | "z")}
          className={`border border-gray-300 rounded-md py-1 px-2 ${darkMode ? "bg-gray-800 text-white" : ""}`}
        >
          <option value="x">Sort by Date</option>
          <option value="z">Sort by Distance</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
            className="mr-2"
          />
          I don&apos;t like good advice, reverse it back
        </label>
      </div>
      <div ref={containerRef} />
    </div>
  );
};

export const BetterColorScales = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="mr-2"
          />
          Dark mode
        </label>
      </div>
      <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : ""}`}>
        <p className="mb-4 font-bold text-lg">Inverted color scale (sqrt)</p>
        <Waffle scaleType="sqrt" darkMode={darkMode} />
        <p className="mb-4 font-bold text-lg">Inverted color scale (linear)</p>
        <Waffle scaleType="linear" darkMode={darkMode} />
        <p className="mb-4 font-bold text-lg">Inverted color scale (log)</p>
        <Waffle scaleType="log" darkMode={darkMode} />
      </div>
    </div>
  );
};

export default function BetterColorScalesPage() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Better color scales than ever before
      </p>
      <div className="min-h-[800px] w-full">
        <BetterColorScales />
      </div>
    </>
  );
}
