"use client";

import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import data from "./benchmark-data.json";

export interface BenchmarkTask {
  name: string;
  opsPerSecond: number;
  [key: string]: unknown;
}

interface BenchmarkSuite {
  name: string;
  tasks: Array<{ name: string; opsPerSecond: number }>;
}

interface BenchmarkFile {
  suites: BenchmarkSuite[];
}

interface BenchmarkData {
  files: BenchmarkFile[];
}

interface DatabenchProps {
  tasks: BenchmarkTask[];
  title?: string;
}

const Databench = ({ tasks, title }: DatabenchProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tasks.length || !containerRef.current) return;

    const plot = Plot.plot({
      width: 1200,
      height: 400,
      marginBottom: 80,
      marginLeft: 60,
      x: {
        type: "band",
        label: "Task",
      },
      y: {
        grid: true,
        label: "Operations per second",
        type: "log",
      },
      color: {
        scheme: "Observable10",
        legend: true,
        label: "Task",
      },
      marks: [
        Plot.ruleY([0]),
        Plot.barY(tasks, {
          x: "name",
          y: "opsPerSecond",
          tip: true,
          fill: "name",
        }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [tasks]);

  return (
    <div className="mb-12">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title.replace(/people-(\d+)\.csv/, "(Row count: $1)")}</h3>
      )}
      <div ref={containerRef} />
    </div>
  );
};

function getSuites(data: BenchmarkData): Array<{ name: string; tasks: BenchmarkTask[] }> {
  const suites: Array<{ name: string; tasks: BenchmarkTask[] }> = [];
  for (const file of data.files) {
    for (const suite of file.suites) {
      suites.push({
        name: suite.name,
        tasks: suite.tasks as BenchmarkTask[],
      });
    }
  }
  return suites;
}

const suites = getSuites(data as BenchmarkData);

export default function DatabenchPage() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Benchmark iterations by task for each benchmark suite.
      </p>
      <div className="min-h-[800px] w-full">
        {suites.map((suite) => (
          <Databench
            key={suite.name}
            tasks={suite.tasks}
            title={suite.name}
          />
        ))}
      </div>
    </>
  );
}
