"use client";

import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";
import { VegaEmbed, VegaEmbedProps } from "react-vega";

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
    // Initialize chart
    const chart = init(chartRef.current, null, chartSettings);

    return () => {
      chart?.dispose();
    };
  }, []);

  useEffect(() => {
    const chart = getInstanceByDom(chartRef.current!);
    chart?.setOption(option, optionSettings);
  }, [option, optionSettings]);

  useEffect(() => {
    // Re-render chart when option changes
    const chart = getInstanceByDom(chartRef.current!);

    chart?.setOption(option, optionSettings);
  }, [option, optionSettings]);

  return <div ref={chartRef} style={style} {...props} />;
};

const option: EChartsOption = {
  textStyle: {
    fontFamily: "'Adobe Clean', sans-serif",
  },
  title: {
    text: "Loyalty is the lowest among the price-sensitive cohort",
    left: "3.5%",
    right: "4.5%",
    textAlign: "left",
    textStyle: {
      fontSize: 40,
      fontWeight: 900,
    },
    subtextStyle: {
      fontSize: 20,
      lineOverflow: "truncate",
    },
    subtext:
      "Price sensitive users have the lowest loyalty of all cohorts. This suggests that they perceive less value in the product\nand are less likely to become strong advocates",
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "2%",
    right: "4%",
    bottom: "3%",
    top: "200px",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: true,
    axisLine: {
      lineStyle: {
        color: "#DDD",
      },
    },
    data: [
      "Price-sensitive",
      "Lapsed",
      "First-time",
      "Frequent",
      "High-value",
      "Enterprise",
    ],
  },
  yAxis: {
    type: "value",
    name: "AVERAGE NPS",
    nameGap: 35,
    nameLocation: "end",
    nameTextStyle: {
      padding: [0, 0, 0, -10],
      fontWeight: 900,
    },
    interval: 20,
    maxInterval: 20,
    minInterval: 20,
    splitLine: {
      lineStyle: {
        width: 2,
        color: "#EEE",
        shadowBlur: 1,
        shadowColor: "#EEE",
        shadowOffsetX: -40,
      },
    },
    axisLabel: {
      align: "left",
      baseline: "bottom",
      padding: [0, 10, 8, 10],
      margin: 50,
    },
    position: "left",
  },
  series: [
    {
      color: "#333",
      name: "Direct",
      type: "bar",
      data: [25, 37, 48, 50, 60, 68],
    },
  ],
};

const vegaSpec: VegaEmbedProps["spec"] = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "A simple bar chart with embedded data.",
  width: 1000,
  height: 600,
  title: {
    text: "Loyalty is the lowest among the price-sensitive cohort",
    fontSize: 40,
    fontWeight: 900,
    font: "'Adobe Clean', sans-serif",
    color: "#333",
    anchor: "start",
    subtitle:
      "Price sensitive users have the lowest loyalty of all cohorts. This suggests that they perceive less value in the product",
    subtitleFontSize: 20,
    subtitleFont: "'Adobe Clean', sans-serif",
    subtitleColor: "#333",
    subtitlePadding: 10,
  },
  config: {
    axis: {
      labelFont: "'Adobe Clean', sans-serif",
      labelFontSize: 12,
      labelColor: "#333",
    },
    style: {
      cell: {
        stroke: "transparent",
      },
    },
    title: {
      offset: 40,
      subtitleColor: "#555",
    }
  },
  padding: {
    left: 30
  },
  autosize: "fit",
  data: {
    values: [
      { a: "Price-sensitive", b: 25 },
      { a: "Lapsed", b: 37 },
      { a: "First-time", b: 48 },
      { a: "Frequent", b: 50 },
      { a: "High-value", b: 60 },
      { a: "Enterprise", b: 68 },
    ],
  },
  mark: {
    type: "bar",
    color: "#333",
    xOffset: 35,
  },
  encoding: {
    x: {
      field: "a",
      type: "nominal",
      axis: { labelAngle: 0, domainColor: "transparent", domain: false, labelOffset: 35, ticks: false, labelPadding: 10 },
      sort: "y",
      scale: { paddingInner: 0.3 },
      title: "",
    },
    y: {
      field: "b",
      type: "quantitative",
      title: "",
      axis: {
        tickCount: 4,
        tickSize: -20,
        labelOffset: -15,
        tickColor: "transparent",
        domainColor: "transparent",
        domain: false,
      },
      scale: { domain: [0, 80] },
    },
  },
};

const TuckedTicks = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">ECharts</h2>
      <div className="mt-6 mb-12 w-full">
        <EChart
          option={option}
          chartSettings={{
            renderer: "canvas",
            height: 680,
          }}
        />
      </div>
      <h2 className="text-2xl font-bold">Vega</h2>
      <div className="mt-10 w-full">
        <VegaEmbed spec={vegaSpec} />
      </div>
    </div>
  );
};

export default TuckedTicks;
