"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useMemo, useRef } from "react";

export const meta = {
  slug: "sfo",
  title: "Trip to SFO",
  publishedAt: "2026-04-20",
  summary:
    "Approval matrix for my time in San Francisco.",
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
    label: "Wharf food",
    brilliantDespicable: 25,
    lowHighBrow: 10,
  },
  {
    label:
      "Daniel gets his own room at the Fairmont, which may have been the walk-in closet",
    brilliantDespicable: 14,
    lowHighBrow: 80,
  },
  {
    label: 'Riding in a Waymo',
    brilliantDespicable: 58,
    lowHighBrow: 45,
  },
  {
    label: 'Mission Burrito on the move',
    brilliantDespicable: 78,
    lowHighBrow: 24,
  },
  {
    label: "Beholding the the ocean from the Presidio",
    brilliantDespicable: 88,
    lowHighBrow: 82,
  },
  {
    label: "Throwing rocks into the ocean from the Presidio",
    brilliantDespicable: 36,
    lowHighBrow: 26,
  },
  {
    label: "Visiting 18 different playgrounds",
    brilliantDespicable: 88,
    lowHighBrow: 4,
  },
  {
    label: "Fancy Italian sandwich at the Joe DiMaggio playground",
    brilliantDespicable: 40,
    lowHighBrow: 55,
  },
  {
    label: "TUNNEL. TOPS.",
    brilliantDespicable: 93,
    lowHighBrow: 40,
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

const labelStyle = {
  fontFamily: SERIF,
  fontSize: 15,
  fontWeight: 400,
  fill: INK,
  borderColor: INK,
  borderWidth: 2,
  padding: 8,
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
    graphic: [
      {
        type: "text",
        left: "center",
        top: 97,
        style: {
          text: "Highbrow",
          ...labelStyle,
        },
      },
      {
        type: "text",
        left: "center",
        bottom: 54,
        style: {
          text: "Lowbrow",
          ...labelStyle,
        },
      },
      {
        type: "text",
        left: 97,
        top: "47%",
        rotation: Math.PI / 2,
        style: {
          text: "Despicable",
          ...labelStyle,
        },
      },
      {
        type: "text",
        right: 97,
        top: "48%",
        rotation: -Math.PI / 2,
        style: {
          text: "Brilliant",
          ...labelStyle,
        },
      },
    ],
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
    xAxis: [
      {
        type: "value",
        min: 0,
        max: 100,
        interval: 2,
        position: "bottom",
        axisLine: {
          show: false,
          lineStyle: { color: INK, width: 2 },
          onZero: false,
        },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: "#e8e6e1", width: 1, type: "solid" },
        },
        axisLabel: {
          showMinLabel: false,
          showMaxLabel: false,
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 100,
        interval: 2,
        position: "left",
        axisLine: {
          show: false,
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
            width: 1,
            type: "solid",
          },
        },
        axisLabel: {
          showMinLabel: false,
          showMaxLabel: false,
          show: false,
        },
      },
    ],
    series: [
      {
        type: "scatter",
        name: "Items",
        data: scatterData,
        symbolSize: 8,
        itemStyle: {
          color: INK,
          borderColor: INK,
          borderWidth: 1.5,
        },
        emphasis: {
          scale: 1.35,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(11, 11, 11, 0.35)",
          },
        },
        label: {
          show: true,
          formatter: "{b}",
          position: "top",
          distance: 8,
          color: INK,
          fontSize: 11,
          fontWeight: 500,
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
                itemStyle: { color: "rgba(209, 209, 209, 0.09)" },
              },
              { xAxis: 50, yAxis: 50 },
            ],
            [
              {
                xAxis: 50,
                yAxis: 100,
                itemStyle: { color: "rgba(209, 209, 209, 0.09)" },
              },
              { xAxis: 100, yAxis: 50 },
            ],
            [
              {
                xAxis: 0,
                yAxis: 50,
                itemStyle: { color: "rgba(209, 209, 209, 0.09)" },
              },
              { xAxis: 50, yAxis: 0 },
            ],
            [
              {
                xAxis: 50,
                yAxis: 50,
                itemStyle: { color: "rgba(209, 209, 209, 0.09)" },
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
        <h3 className="text-2xl font-semibold mt-8 mb-2 text-gray-800"> Takeaways: </h3>
        <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
          <li className="pl-2 pt-2">Lots of playgrounds.</li>
        </ul>
      </>
    </ChartPageLayout>
  );
}
