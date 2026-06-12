"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useMemo, useRef } from "react";
import rawData from "./usage.json";

export const meta = {
  slug: "recent-token-usage",
  title: "Recent Token Usage",
  publishedAt: "2026-06-12",
  summary: "Charting AI token usage during the recent weeks.",
} as const;

type UsageDay = {
  readonly date: string;
  readonly msgs: number;
  readonly total: number;
  readonly cost: number;
};

const mayUsage = (rawData as UsageDay[])
  .filter((item) => item.date.startsWith("2026-05"))
  .sort((a, b) => a.date.localeCompare(b.date));

const formatTokens = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toLocaleString();
};

const seriesData = (key: keyof Pick<UsageDay, "total" | "cost" | "msgs">) =>
  mayUsage.map((item) => [item.date, item[key]]);

const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "560px" },
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

export default function Page() {
  const option: EChartsOption = useMemo(
    () => ({
      color: ["#2563eb", "#059669", "#d97706"],
      legend: {
        top: 0,
        data: ["Total", "Cost", "Messages"],
      },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          if (!Array.isArray(params) || params.length === 0) {
            return "";
          }
          const date = (params[0].value as [string, number])[0];
          const day = mayUsage.find((item) => item.date === date);
          if (!day) {
            return date;
          }
          return [
            date,
            `Total: ${formatTokens(day.total)} tokens`,
            `Cost: $${day.cost.toFixed(2)}`,
            `Messages: ${day.msgs.toLocaleString()}`,
          ].join("<br />");
        },
      },
      grid: {
        left: 56,
        right: 48,
        top: 40,
        bottom: 40,
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: "{MMM} {d}",
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Tokens",
          position: "left",
          axisLabel: {
            formatter: (value: number) => formatTokens(value),
          },
        },
        {
          type: "value",
          name: "Cost / Messages",
          position: "right",
        },
      ],
      series: [
        {
          name: "Total tokens",
          data: seriesData("total"),
          type: "line",
          yAxisIndex: 0,
          showSymbol: true,
          symbolSize: 6,
        },
        {
          name: "Cost",
          data: seriesData("cost"),
          type: "bar",
          stack: "usage",
          yAxisIndex: 1,
          barMaxWidth: 20,
        },
        {
          name: "Messages",
          data: seriesData("msgs"),
          type: "bar",
          stack: "usage",
          yAxisIndex: 1,
          barMaxWidth: 20,
        },
      ],
    }),
    [],
  );

  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <>
        <p className="text-base leading-7 mb-4 text-gray-700">
          Total tokens (line, left axis) with cost and messages as stacked bars
          (right axis).
        </p>
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-md border border-gray-200 bg-neutral-50">
          <EChart
            option={option}
            chartSettings={{ renderer: "canvas", height: 560 }}
          />
        </div>
      </>
    </ChartPageLayout>
  );
}
