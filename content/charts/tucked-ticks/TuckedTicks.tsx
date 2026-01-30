"use client";

import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useMemo, useRef } from "react";

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
    left: "4.5%",
		right: "4.5%",
    textAlign: "left",
    textStyle: {
      fontSize: 40,
    },
    subtextStyle: {
      fontSize: 20,
      lineOverflow: "truncate",
    },
    subtext:
      "Price sensitive users have the lowest loyalty of all cohorts. This suggests that they perceive less value in the product and are less likely to become strong advocates",
  },
  tooltip: {
    trigger: "axis",
  },
	
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "175px",
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
    nameGap: 30,
    nameLocation: "end",
    nameTextStyle: {
      padding: [0, 0, 10, 5],
      fontWeight: 700,
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
				shadowOffsetX: -40
      },
    },
    axisLabel: {
      align: "left",
      baseline: "bottom",
      padding: [0, 10, 10, 10],
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
		}
  ],
};

const TuckedTicks = () => {
  return (
    <EChart
      option={option}
      chartSettings={{
        renderer: "canvas",
        height: 680,
      }}
    />
  );
};

export default TuckedTicks;
