"use client";

import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";
import data from "./data.json";
import wavesPattern from "./waves.png";

const TideCharts = () => {
  const EChart = ({
    option,
    chartSettings,
    optionSettings,
    style = { width: "100%", height: "500px" },
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

  const date = new Date(data.date)

  return (
    <div>
      <EChart
        option={{
            title: {
                text: date.toDateString().toUpperCase(),
                left: 'left',
                textStyle: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#333',
                },
                subtext: `sunrise ${new Date(data.astronomy.sunrise).toLocaleTimeString()}   sunset ${new Date(data.astronomy.sunset).toLocaleTimeString()}`,
                subtextStyle: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: '#666',
                    align: 'left',
                    verticalAlign: 'top',
                },
            },
          xAxis: {
            type: "time",
            axisLabel: {
                formatter: '{hh}',
            },
            minorTick: {
                show: true
            }
          },
          yAxis: {},
          animation: true,
          tooltip: {
            alwaysShowContent: true,
            trigger: "axis",
          },
          series: [
            {
              data: data.tide_events.map((event) => [event.time, event.height]),
              type: "line",
              color: "#555",
              smooth: true,
              markPoint: {
                data: [
                  { type: "max", name: "High tide" },
                  { type: "min", name: "Low tide" },
                ],
              },
              areaStyle: {
                color: {
                  image: wavesPattern.src,
                  scaleX: .75,
                  scaleY: .75,
                },
                opacity: 0.75,
              },
              lineStyle: {
                width: 5,
              },
            },
          ],
          grid: {
            top: 100,
            left: "5%",
            right: "5%",
          },
        }}
        chartSettings={{
          renderer: "canvas",
          height: 650,
        }}
      />
    </div>
  );
};

export default TideCharts;
