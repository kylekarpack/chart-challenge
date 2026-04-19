"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useMemo, useRef } from "react";

export const meta = {
  slug: "sfo",
  title: "Vizzy Takes a Trip to SFO",
  publishedAt: "2026-04-16",
  summary:
    "An NY Mag–style Approval Matrix: SFO culture plotted on brilliant vs. despicable and highbrow vs. lowbrow.",
} as const;

export type ApprovalMatrixItem = {
  readonly label: string;
  /** 0 = Despicable, 100 = Brilliant */
  readonly brilliantDespicable: number;
  /** 0 = Lowbrow, 100 = Highbrow */
  readonly lowHighBrow: number;
};

export const sfoApprovalMatrixItems: ApprovalMatrixItem[] = [
  {
    label: "Eating one of everything from a bakery in Chinatown in one sitting",
    brilliantDespicable: 13,
    lowHighBrow: 20,
  },
  {
    label: "Ordering one of everything from a bakery in Chinatown",
    brilliantDespicable: 73,
    lowHighBrow: 70,
  },
  {
    label:
      "Daniel gets his own room at the Fairmont. It may have been the walk-in closet.",
    brilliantDespicable: 14,
    lowHighBrow: 80,
  },
  {
    label: 'Riding in a Waymo saying "weeeeee"',
    brilliantDespicable: 46,
    lowHighBrow: 25,
  },
  {
    label: "Beholding the vastness of the ocean from the Presidio",
    brilliantDespicable: 88,
    lowHighBrow: 82,
  },
  {
    label: "Throwing rocks into the ocean from the Presidio",
    brilliantDespicable: 28,
    lowHighBrow: 13,
  },
  {
    label: "Visiting 18 different playgrounds",
    brilliantDespicable: 88,
    lowHighBrow: 4,
  },

  {
    label: "Spending time with the best team ever",
    brilliantDespicable: 100,
    lowHighBrow: 100,
  },
];

const NY_RED = "#c41230";
const INK = "#111111";
const PAPER = "#faf9f6";
const SERIF =
  "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif";

const axisPoleRich = {
  pole: {
    fontFamily: SERIF,
    fontSize: 15,
    fontWeight: 700,
    color: INK,
    padding: [2, 0, 0, 0] as number[],
  },
};

const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "1000px" },
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

function buildOption(): EChartsOption {
  const scatterData = sfoApprovalMatrixItems.map((d) => ({
    name: d.label,
    value: [d.brilliantDespicable, d.lowHighBrow] as [number, number],
  }));

  return {
    backgroundColor: PAPER,
    textStyle: {
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: INK,
    },
    title: [
      {
        text: "THE APPROVAL MATRIX",
        left: "center",
        top: 28,
        textStyle: {
          fontSize: 13,
          fontWeight: 700,
          color: INK,
        },
      },
      {
        text: "Vizzy’s SFO Dispatch",
        left: "center",
        top: 52,
        textStyle: {
          fontSize: 22,
          fontWeight: 700,
          color: INK,
          fontFamily: "Georgia, 'Times New Roman', serif",
        },
      },
    ],
    grid: {
      left: "12%",
      right: "12%",
      top: 130,
      bottom: 88,
      containLabel: false,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(17,17,17,0.92)",
      borderWidth: 0,
      textStyle: { color: "#fff", fontSize: 13 },
      formatter(params) {
        const p = params as { name?: string; value?: number[] };
        const [x, y] = p.value ?? [];
        if (x === undefined || y === undefined) return "";
        return `<div style="font-weight:600;margin-bottom:6px">${p.name}</div>
          <div style="opacity:0.9">Brilliant–Despicable: <b>${Math.round(x)}</b></div>
          <div style="opacity:0.9">Low–Highbrow: <b>${Math.round(y)}</b></div>`;
      },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 100,
      /** Only pole ticks — matches print matrix (no 25/50/75). */
      interval: 100,
      name: "",
      axisLine: {
        show: true,
        lineStyle: { color: INK, width: 2 },
        onZero: false,
      },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: "#e8e6e1", type: "dashed" },
      },
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        hideOverlap: true,
        margin: 18,
        color: INK,
        align: "center",
        verticalAlign: "top",
        formatter(value: number) {
          if (value === 0) {
            return "{pole|Despicable}";
          }
          if (value === 100) {
            return "{pole|Brilliant}";
          }
          return "";
        },
        rich: axisPoleRich,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 100,
      axisLine: {
        show: true,
        lineStyle: {
          color: INK,
          width: 2,
        },
        onZero: false,
      },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e8e6e1",
          type: "dashed",
        },
      },
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        hideOverlap: true,
        margin: 14,
        color: INK,
        align: "center",
        verticalAlign: "middle",
        formatter(value: number) {
          if (value === 0) {
            return "{pole|Lowbrow}";
          }
          if (value === 100) {
            return "{pole|Highbrow}";
          }
          return "";
        },
        rich: axisPoleRich,
      },
    },
    series: [
      {
        type: "scatter",
        name: "Items",
        data: scatterData,
        symbolSize: 10,
        itemStyle: {
          color: NY_RED,
          borderColor: INK,
          borderWidth: 1.5,
        },
        emphasis: {
          scale: 1.35,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(196,18,48,0.35)",
          },
        },
        label: {
          show: true,
          formatter: "{b}",
          position: "top",
          distance: 8,
          color: INK,
          fontSize: 11,
          fontWeight: 600,
          overflow: "break",
          width: 120,
        },
        labelLayout: { hideOverlap: true },
        markArea: {
          silent: true,
          data: [
            [
              {
                xAxis: 0,
                yAxis: 100,
                itemStyle: { color: "rgba(196,18,48,0.06)" },
              },
              { xAxis: 50, yAxis: 50 },
            ],
            [
              {
                xAxis: 50,
                yAxis: 100,
                itemStyle: { color: "rgba(17,17,17,0.03)" },
              },
              { xAxis: 100, yAxis: 50 },
            ],
            [
              {
                xAxis: 0,
                yAxis: 50,
                itemStyle: { color: "rgba(17,17,17,0.03)" },
              },
              { xAxis: 50, yAxis: 0 },
            ],
            [
              {
                xAxis: 50,
                yAxis: 50,
                itemStyle: { color: "rgba(196,18,48,0.05)" },
              },
              { xAxis: 100, yAxis: 0 },
            ],
          ],
        },
        markLine: {
          symbol: "none",
          silent: true,
          lineStyle: { color: INK, width: 1.5, type: "solid" },
          label: { show: false },
          data: [{ xAxis: 50 }, { yAxis: 50 }],
        },
        zlevel: 1,
      },
    ],
  };
}

export default function Page() {
  const option = useMemo(() => buildOption(), []);

  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <>
        <p className="text-base leading-7 mb-4 text-gray-700">
          Here&apos;s what I&apos;ve been up to...
        </p>
        <div className="mt-8 min-h-[740px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200 bg-[#faf9f6]">
          <EChart
            option={option}
            chartSettings={{ renderer: "canvas", height: 1000 }}
          />
        </div>
      </>
    </ChartPageLayout>
  );
}
