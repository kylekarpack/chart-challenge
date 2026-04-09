"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";
import { data } from "./data";

export const meta = {
  slug: "vw-v1",
  title: "VW V1",
  publishedAt: "2026-04-09",
  summary: "A first chart created programatically",
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
  }, [chartSettings]);
  useEffect(() => {
    const chart = getInstanceByDom(chartRef.current!);
    chart?.setOption(option, optionSettings);
  }, [option, optionSettings]);
  return <div ref={chartRef} style={style} {...props} />;
};

const option: EChartsOption = {
  title: {
    text: "Weekly Marketing Performance Metrics",
    left: "center",
    top: "20px",
    textStyle: {
      fontSize: 24,
      fontWeight: "bold",
    },
  },
  dataset: {
    dimensions: [
      "week",
      "spend",
      "impressions",
      "clicks",
      "conversions",
      "revenue",
      "cac",
      "roas",
    ],
    source: data,
  },
  series: [
    {
      type: "line",
      name: "Spend",
      encode: {
        x: "week",
        y: "spend",
      },
      smooth: true,
    },
    {
      type: "line",
      name: "Revenue",
      encode: {
        x: "week",
        y: "revenue",
      },
      smooth: true,
    },
  ],
  xAxis: {
    type: "time",
    name: "Week",
    nameLocation: "middle",
    nameGap: 30,
    axisLabel: {
      formatter: "{MMM} {yyyy}",
    },
  },
  yAxis: {
    type: "value",
    name: "Metric Value",
    nameLocation: "middle",
    nameGap: 63,
  },
  legend: {
    orient: "horizontal",
    align: "auto",
    bottom: "5%",
    data: [
      "spend",
      "impressions",
      "clicks",
      "conversions",
      "revenue",
      "cac",
      "roas",
    ],
  },
  tooltip: {
    trigger: "axis",
    valueFormatter(value, dataIndex) {
      return Math.round(value as number).toLocaleString();
    },
  },
};

export default function Page() {
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <>
        <p className="text-base leading-7 mb-4 text-gray-700">
          A little time capsule for posterity. Here is one of the first charts that I created, solely from a raw dataset and the prompt:
        </p>
        <pre className="text-base leading-7 mb-4 text-gray-700">
          show me insights 
        </pre>
        <div className="mt-12" />
        <div className="min-h-[700px] w-full">
          <div>
            <div className="mt-6 mb-12 w-full">
              <EChart
                option={option}
                chartSettings={{ renderer: "canvas", height: 680 }}
              />
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
          Takeaways:
        </h3>
        <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
          <li className="pl-2 pt-2">We have something working!</li>
          <li className="pl-2 pt-2">This will get a lot better soon</li>
        </ul>
      </>
    </ChartPageLayout>
  );
}
