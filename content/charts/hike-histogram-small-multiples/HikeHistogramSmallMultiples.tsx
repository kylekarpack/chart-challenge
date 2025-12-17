"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import data from "../hike-histogram/data.json";

// Add year to each hike for faceting
const enrichedData = data.map((hike) => ({
  ...hike,
  distance_miles: hike.distance / 1000 / 1.60934,
  year: new Date(hike.date).getFullYear().toString(),
  date: new Date(hike.date)
}));

export const HikeHistogram = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enrichedData === undefined) return;
    const plot = Plot.plot({
      width: 1000,
      height: 250,
      facet: {
        data: enrichedData,
        x: "date",
      },
      color: { scheme: "Blues" },
      marks: [
        Plot.rectY(
          enrichedData,
          Plot.binX({ y: "count", fill: "count" }, { x: "distance_miles" })
        ),
        Plot.axisX({ anchor: "bottom", label: "Distance (miles)", tickSpacing: 20 }),
        Plot.axisY({ anchor: "left", label: "Count" }),
        Plot.frame(),
      ],
      fx: { label: "Year" },
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};
