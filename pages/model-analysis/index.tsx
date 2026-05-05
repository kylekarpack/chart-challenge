"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useMemo, useRef } from "react";

export const meta = {
  slug: "model-analysis",
  title: "Model speed vs Intelligence",
  publishedAt: "2026-05-05",
  summary:
    "Scatter plot inspired by Artificial Analysis: seconds to output 500 tokens vs intelligence index.",
} as const;

/** Visually estimated from a reference scatter (not official API data). */
export type ModelPoint = {
  readonly name: string;
  /** Seconds to output 500 tokens (incl. reasoning). */
  readonly seconds500: number;
  /** Artificial Analysis–style intelligence index (0–100). */
  readonly intelligenceIndex: number;
  readonly family:
    | "openai"
    | "google"
    | "anthropic"
    | "xai"
    | "mistral"
    | "qwen"
    | "minimax"
    | "glm"
    | "deepseek"
    | "kimi"
    | "other"
    | "googlePro";
};

export const modelPoints: ModelPoint[] = [
  {
    name: "GPT-5.4 mini (xhigh)",
    seconds500: 8,
    intelligenceIndex: 49,
    family: "openai",
  },
  {
    name: "Gemini 3 Flash",
    seconds500: 10,
    intelligenceIndex: 47,
    family: "google",
  },
  {
    name: "gpt-oss-120B (high)",
    seconds500: 11,
    intelligenceIndex: 33,
    family: "openai",
  },
  {
    name: "gpt-oss-20B (high)",
    seconds500: 9,
    intelligenceIndex: 25,
    family: "openai",
  },
  {
    name: "GPT-4o mini",
    seconds500: 15,
    intelligenceIndex: 13,
    family: "openai",
  },
  {
    name: "Mistral Small 4",
    seconds500: 16,
    intelligenceIndex: 28,
    family: "mistral",
  },
  {
    name: "Claude 4.5 Haiku",
    seconds500: 23,
    intelligenceIndex: 37,
    family: "anthropic",
  },
  {
    name: "Claude Opus 4.7 (max)",
    seconds500: 32,
    intelligenceIndex: 57,
    family: "anthropic",
  },
  {
    name: "Gemini 3.1 Pro Preview",
    seconds500: 36,
    intelligenceIndex: 53,
    family: "googlePro",
  },
  {
    name: "Grok 4.3",
    seconds500: 38,
    intelligenceIndex: 58,
    family: "xai",
  },
  {
    name: "MiMo-V2.5-Pro",
    seconds500: 41,
    intelligenceIndex: 54,
    family: "other",
  },
  {
    name: "MiniMax-M2.7",
    seconds500: 55,
    intelligenceIndex: 50,
    family: "minimax",
  },
  {
    name: "Gemma 4 31B",
    seconds500: 72,
    intelligenceIndex: 39,
    family: "google",
  },
  {
    name: "Qwen3.5 397B A17B",
    seconds500: 72,
    intelligenceIndex: 45,
    family: "qwen",
  },
  {
    name: "Qwen3.6 Max Preview",
    seconds500: 72,
    intelligenceIndex: 52,
    family: "qwen",
  },
  {
    name: "GLM-5.1",
    seconds500: 75,
    intelligenceIndex: 52,
    family: "glm",
  },
  {
    name: "GPT-5.5 (xhigh)",
    seconds500: 76,
    intelligenceIndex: 60,
    family: "openai",
  },
  {
    name: "DeepSeek V4 Flash (Max)",
    seconds500: 78,
    intelligenceIndex: 47,
    family: "deepseek",
  },
  {
    name: "Claude Sonnet 4.6 (max)",
    seconds500: 104,
    intelligenceIndex: 52,
    family: "anthropic",
  },
  {
    name: "DeepSeek V4 Pro (Max)",
    seconds500: 145,
    intelligenceIndex: 52,
    family: "deepseek",
  },
  {
    name: "Kimi K2.6",
    seconds500: 147,
    intelligenceIndex: 54,
    family: "kimi",
  },
  {
    name: "GPT-5.4 (xhigh)",
    seconds500: 192,
    intelligenceIndex: 57,
    family: "openai",
  },
];

/** One distinct color per provider family (12-way categorical, tuned for a light background). */
const FAMILY_COLOR: Record<ModelPoint["family"], string> = {
  openai: "#0f172a", // slate-900
  anthropic: "#9a3412", // orange-800
  google: "#166534", // green-800
  googlePro: "#6d28d9", // violet-700
  xai: "#0f766e", // teal-700
  mistral: "#c2410c", // orange-700
  qwen: "#be123c", // rose-700
  minimax: "#a21caf", // fuchsia-800
  glm: "#1d4ed8", // blue-700
  deepseek: "#4338ca", // indigo-700
  kimi: "#0e7490", // cyan-800
  other: "#a16207", // yellow-700
};

/** Stable legend order (only families present in data are shown). */
const PROVIDER_LEGEND_ORDER: ModelPoint["family"][] = [
  "openai",
  "anthropic",
  "google",
  "googlePro",
  "xai",
  "mistral",
  "qwen",
  "minimax",
  "glm",
  "deepseek",
  "kimi",
  "other",
];

const PROVIDER_LABEL: Record<ModelPoint["family"], string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  googlePro: "Google (Pro)",
  xai: "xAI",
  mistral: "Mistral",
  qwen: "Qwen",
  minimax: "MiniMax",
  glm: "GLM",
  deepseek: "DeepSeek",
  kimi: "Kimi",
  other: "Other",
};

const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "640px" },
  ...props
}: {
  option: EChartsOption;
  chartSettings?: object;
  optionSettings?: object;
  style?: object;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = chartRef.current;
    if (!el) {
      return;
    }
    const chart = init(el, null, chartSettings);
    return () => chart.dispose();
  }, [chartSettings]);
  useEffect(() => {
    const el = chartRef.current;
    if (!el) {
      return;
    }
    const chart = getInstanceByDom(el);
    chart?.setOption(option, optionSettings);
  }, [option, optionSettings]);
  return <div ref={chartRef} style={style} {...props} />;
};

const scatterSeriesBase = {
  type: "scatter" as const,
  symbolSize: 10,
  emphasis: {
    scale: 1.25,
    itemStyle: { shadowBlur: 14, shadowColor: "rgba(0,0,0,0.2)" },
  },
  label: {
    show: true,
    formatter: "{b}",
    position: "top" as const,
    distance: 6,
    fontSize: 9,
    color: "#404040",
    width: 200,
    overflow: "break" as const,
  },
  labelLayout: {
    hideOverlap: true,
  },
};

const markAreaZones = {
  silent: true,
  data: [
    [
      {
        xAxis: 0,
        yAxis: 50,
        itemStyle: { color: "rgba(34, 197, 94, 0.12)" },
      },
      { xAxis: 110, yAxis: 100 },
    ],
    [
      {
        xAxis: 110,
        yAxis: 0,
        itemStyle: { color: "rgba(115, 115, 115, 0.1)" },
      },
      { xAxis: 220, yAxis: 50 },
    ],
  ],
};

function buildOption(): EChartsOption {
  const familiesPresent = new Set(modelPoints.map((d) => d.family));
  const orderedFamilies = PROVIDER_LEGEND_ORDER.filter((f) =>
    familiesPresent.has(f),
  );

  const scatterSeries = orderedFamilies.map((family, index) => ({
    ...scatterSeriesBase,
    name: PROVIDER_LABEL[family],
    data: modelPoints
      .filter((d) => d.family === family)
      .map((d) => ({
        name: d.name,
        value: [d.seconds500, d.intelligenceIndex] as [number, number],
      })),
    itemStyle: {
      color: FAMILY_COLOR[family],
      borderColor: "rgba(0,0,0,0.15)",
      borderWidth: 1,
    },
    markArea: index === 0 ? markAreaZones : undefined,
    zlevel: 1,
  }));

  return {
    backgroundColor: "#fafafa",
    textStyle: {
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: "#171717",
    },
    title: {
      text: "Speed vs Intelligence",
      left: "center",
      top: 12,
      textStyle: { fontSize: 15, fontWeight: 600, color: "#262626" },
    },
    legend: {
      orient: "vertical",
      right: 12,
      top: "middle",
      itemGap: 10,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 11, color: "#404040" },
    },
    grid: { left: 72, right: 148, top: 56, bottom: 72, containLabel: false },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(23,23,23,0.94)",
      borderWidth: 0,
      textStyle: { color: "#fff", fontSize: 13 },
      formatter(params) {
        const p = params as {
          name?: string;
          value?: number[];
          seriesName?: string;
        };
        const [sec, intel] = p.value ?? [];
        if (sec === undefined || intel === undefined) return "";
        const provider =
          p.seriesName === undefined
            ? ""
            : `<div style="opacity:0.85;font-size:12px;margin-bottom:4px">${p.seriesName}</div>`;
        return `<div style="font-weight:600;margin-bottom:6px">${p.name}</div>${provider}
          <div style="opacity:0.92">500-token latency: <b>${sec}s</b></div>
          <div style="opacity:0.92">Intelligence index: <b>${intel}</b></div>`;
      },
    },
    xAxis: {
      type: "value",
      name: "Seconds to output 500 tokens (incl. reasoning)",
      nameLocation: "middle",
      nameGap: 46,
      nameTextStyle: { fontSize: 12, color: "#525252" },
      min: 0,
      max: 220,
      interval: 20,
      splitLine: { lineStyle: { color: "#e5e5e5" } },
      axisLine: { lineStyle: { color: "#a3a3a3" } },
    },
    yAxis: {
      type: "value",
      name: "Intelligence index",
      nameTextStyle: { fontSize: 12, color: "#525252" },
      min: 0,
      max: 100,
      interval: 10,
      splitLine: { lineStyle: { color: "#e5e5e5" } },
      axisLine: { lineStyle: { color: "#a3a3a3" } },
    },
    series: scatterSeries as EChartsOption["series"],
  } satisfies EChartsOption;
}

export default function Page() {
  const option = useMemo(() => buildOption(), []);

  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <>
        <p className="text-base leading-7 mb-4 text-gray-700">
          This reproduces the layout of an{" "}
          <span className="whitespace-nowrap">Artificial Analysis</span>–style
          scatter plot comparing model speed to intelligence index.
        </p>
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-md border border-gray-200 bg-neutral-50">
          <EChart
            option={option}
            chartSettings={{ renderer: "canvas", height: 640 }}
          />
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-800">
          Takeaways
        </h3>
        <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
          <li className="pl-2">
            We all love Claude, and for good reason. It is not as fast as some competitors, but it is very capable.
          </li>
          <li className="pl-2">
            As expected, there are no clear winners here. The right choice is going to depend on use case.
          </li>
          <li className="pl-2">
            Matrices are neat charts.
          </li>
        </ul>
      </>
    </ChartPageLayout>
  );
}
