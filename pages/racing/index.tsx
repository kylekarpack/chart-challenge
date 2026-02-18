"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import Link from "next/link";
import { color } from "d3";
import { EChartsOption, getInstanceByDom, graphic, init } from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import bundesligaData from "./bundesliga_cumulative_goals.json";
import { TEAM_COLORS } from "@/lib/racing/team-colors";
import { TEAM_CRESTS } from "@/lib/racing/team-crests";

export const meta = {
  slug: "racing",
  title: "Bundesliga Race",
  publishedAt: "2026-01-24",
  summary: "Visualizing Bundesliga goals scored over time.",
} as const;

const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "680px" },
  ...props
}: {
  option: EChartsOption;
  chartSettings?: any;
  optionSettings?: any;
  style?: any;
}) => {
  const chartRef = useRef(null);
  useEffect(() => {
    const chart = init(chartRef.current, null, chartSettings);
    return () => chart?.dispose();
  }, []);
  useEffect(() => {
    const chart = getInstanceByDom(chartRef.current!);
    chart?.setOption(option, optionSettings);
  }, [option, optionSettings]);
  return <div ref={chartRef} style={style} {...props} />;
};

function RacingChart() {
  const teams = useMemo(
    () => Object.keys(bundesligaData[0]).filter((key) => key !== "SeasonFrom"),
    []
  );
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const index = Math.min(Math.floor(progress), bundesligaData.length - 1);
  const currentSeasonData = bundesligaData[index];
  const data = useMemo(
    () => teams.map((team) => (currentSeasonData as Record<string, number>)[team]),
    [currentSeasonData, teams]
  );

  const rich = useMemo(
    () =>
      Object.fromEntries(
        teams.map((team, i) => [
          `t${i}`,
          { backgroundColor: { image: TEAM_CRESTS[team] || "" }, height: 24, width: 24, align: "center" },
        ])
      ),
    [teams]
  );

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let frameId: number;
    let isFirstFrame = true;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      setProgress((prevProgress) => {
        if (isFirstFrame && prevProgress === 0) {
          isFirstFrame = false;
          return 1;
        }
        return (prevProgress + delta / 2000) % bundesligaData.length;
      });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  const option: EChartsOption = useMemo(
    () => ({
      textStyle: { fontFamily: "'Adobe Clean', sans-serif" },
      grid: { top: 100, bottom: 40 },
      title: {
        text: "Bundesliga All-Time Goal Total",
        subtext: `Season: ${currentSeasonData.SeasonFrom}`,
        left: "left",
        textStyle: { fontSize: 24, fontWeight: "bold", color: "#333" },
        subtextStyle: { fontSize: 16, fontWeight: "normal", color: "#777" },
      },
      xAxis: {
        max: "dataMax",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#eee" } },
      },
      yAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { margin: 15, fontSize: 14, color: "#666" },
        type: "category",
        data: teams,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 15,
      },
      series: [
        {
          realtimeSort: true,
          name: "Total Goals",
          type: "bar",
          data: data,
          barCategoryGap: "15%",
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
            formatter: (params: any) => `{t${params.dataIndex}|} ${params.value}`,
            rich: rich as any,
          },
          itemStyle: {
            borderRadius: [0, 5, 5, 0],
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.1)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            color: (params: any) => {
              const teamName = teams[params.dataIndex];
              const baseColor = TEAM_COLORS[teamName] || "#4b5563";
              const brighterColor =
                color(baseColor)?.brighter(0.5).copy({ opacity: 0.95 }).toString() || baseColor;
              return new graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: color(baseColor)?.copy({ opacity: 0.9 }).toString() || baseColor },
                { offset: 1, color: brighterColor },
              ]);
            },
          },
        },
      ],
      legend: { show: false },
      animationDuration: 0,
      animationDurationUpdate: 2000,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
    }),
    [currentSeasonData.SeasonFrom, data, rich, teams]
  );

  return (
    <div className="flex flex-col gap-4">
      <EChart option={option} chartSettings={{ renderer: "canvas", height: 680 }} />
      <div className="flex items-center gap-6 px-6 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm w-full">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-tight mb-1">
            {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((p, i) => {
              const targetIndex = Math.min(
                Math.floor(p * (bundesligaData.length - 1)),
                bundesligaData.length - 1
              );
              const label = bundesligaData[targetIndex].SeasonFrom;
              const isCurrent = index === targetIndex;
              return (
                <span
                  key={i}
                  className={isCurrent ? "text-slate-900 font-bold scale-110 transition-all" : "transition-all"}
                >
                  {label}
                </span>
              );
            })}
          </div>
          <input
            type="range"
            min={0}
            max={bundesligaData.length - 1}
            step="any"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>
      </div>
    </div>
  );
}

function ChartContent() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Racing bar charts are pretty silly, so of course I wanted to make one myself! I saw one on{" "}
        <Link href="https://flourish.studio/visualisations/bar-chart-race/" className="text-blue-600 hover:text-blue-800 underline">
          Flourish
        </Link>{" "}
        a few years ago, and it sure made for a fun demo.
      </p>
      <div className="min-h-[700px] w-full">
        <RacingChart />
      </div>
      <div className="mt-8" />
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">Some takeaways:</h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">Acquiring, cleaning, and processing the data was way more difficult than making the charts</li>
        <li className="pl-2 pt-2">ECharts effortlessly did a ton of the heavy lifting regarding animations and transitions</li>
        <li className="pl-2 pt-2">Racing bar charts are kind of ridiculous, and they aren&apos;t a terribly useful data visualization, but they&apos;re fun!</li>
        <li className="pl-2 pt-2">There are very few data sets for which this visualization makes sense. It would need to measure something that accumulates over time, but on a data set with a limited number of categories (sports leagues, countries, etc.)</li>
        <li className="pl-2 pt-2">
          I&apos;m a Bayern fan - it gets better as it goes!{" "}
          <img className="inline w-[24px] h-[31px]" src="https://tmssl.akamaized.net//images/wappen/medium/27.png" alt="Bayern badge" />
        </li>
      </ul>
    </>
  );
}

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <ChartContent />
    </ChartPageLayout>
  );
}
