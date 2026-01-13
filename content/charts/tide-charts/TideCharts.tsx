"use client";

import { init, getInstanceByDom, graphic, EChartsOption } from "echarts";
import { useRef, useEffect } from "react";
import { wavesPattern } from "./waves";
import data from "./data.json";

const TideCharts = () => {
  const EChart = ({
    option,
    chartSettings,
    optionSettings,
    style = { width: "100%", height: "800px" },
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
    }, [chartSettings]);

    useEffect(() => {
      // Re-render chart when option changes
      const chart = getInstanceByDom(chartRef.current!);

      chart?.setOption(option, optionSettings);
    }, [option, optionSettings]);

    return <div ref={chartRef} style={style} {...props} />;
  };

  return (
    <div>
      <EChart
        option={{
          xAxis: {
            type: "time",
          },
          yAxis: {},
          animation: true,
          tooltip: {
            alwaysShowContent: true,
            trigger: "axis"
          },
          series: [
            {
              data: data.tide_events.map(event => ([event.time, event.height])),
              color: "#444",
              type: "line",
              smooth: true,
              areaStyle: {
                color: {
                  image: wavesPattern,
                },
              },
              lineStyle: {
                width: 2,
              },
            },
          ],
          grid: {
            left: "0%",
            right: "0%",
          },
        }}
        chartSettings={{
          renderer: "canvas",
          height: 800,
        }}
      />
    </div>
  );
};

export default TideCharts;
