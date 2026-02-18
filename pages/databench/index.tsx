"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import data from "./benchmark-data.json";

export const meta = {
  slug: "databench",
  title: "Databench",
  publishedAt: "2026-02-17",
  summary: "Benchmark some data processing options",
} as const;

interface BenchmarkTask {
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

function getSuites(
  data: BenchmarkData,
): Array<{ name: string; tasks: BenchmarkTask[] }> {
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

function DatabenchChart({ tasks, title }: { tasks: BenchmarkTask[]; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tasks.length || !containerRef.current) return;

    const plot = Plot.plot({
      width: 1200,
      height: 400,
      marginLeft: 60,
      marginBottom: 80,
      x: { type: "band", label: "Task", tickRotate: -25},
      y: { label: "Operations per second", type: "sqrt" },
      color: { scheme: "Observable10", legend: true, label: "Task" },
      marks: [
        Plot.ruleY([0]),
        Plot.barY(tasks, { x: "name", y: "opsPerSecond", tip: true, fill: "name" }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [tasks]);

  return (
    <div className="mb-12">
      {title && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">
            {title.replace(/people-(\d+)\.csv/, "(Row count: $1)")}
          </h3>
          <h4 className="text-sm text-gray-500 mb-2 ">
            Operations per second (higher is better)
          </h4>
        </>
      )}
      <div ref={containerRef} />
    </div>
  );
}

function ChartContent() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Benchmark iterations by task for each benchmark suite.
      </p>
      <div className="min-h-[800px] w-full">
        {suites.map((suite) => (
          <DatabenchChart key={suite.name} tasks={suite.tasks} title={suite.name} />
        ))}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <ChartContent />

      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">Takeaways:</h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">
          Raw JavaScript is the fastest on small datasets. Somewhere between 1000 and 10k rows, Rust-based options become markedly faster.
        </li>
        <li className="pl-2 pt-2">
          Apache Datafusion was hard to use, but was lightning fast on massive datasets. On 1M rows, it parsed 25x faster and ran statistical operations almost 2000x faster than raw JS. 
        </li>
        <li className="pl-2 pt-2">
          JS-based dataframe libraries cannot handle large datasets well.
        </li>
      </ul>
    </ChartPageLayout>
  );
}
