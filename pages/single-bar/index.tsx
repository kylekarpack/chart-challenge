"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";

export const meta = {
  slug: "single-bar",
  title: "Single Bar for a Busy Month",
  publishedAt: "2026-05-29",
  summary:
    "A single bar chart for a busy month.",
} as const;


const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "500px" },
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

  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Readiness for the weekend (out of 100)']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [98],
        type: "bar",
        barMaxWidth: 100,
      },
    ],
  };
    
  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <>
        <p className="text-base leading-7 mb-4 text-gray-700">
          This is all.
        </p>
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-md border border-gray-200 bg-neutral-50">
          <EChart
            option={option}
            chartSettings={{ renderer: "canvas", height: 500 }}
          />
        </div>
      </>
    </ChartPageLayout>
  );
}
