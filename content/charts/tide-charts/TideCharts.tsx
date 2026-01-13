"use client";

import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef, useState } from "react";
// import data from "./data.json";
import wavesPattern from "./waves.png";
import { getSeattleTides, getSunData } from "./util";

const fullIntl = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dayIntl = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const hourIntl = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});

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

const TideCharts = () => {
  const [data, setData] = useState<any>({ predictions: [], astronomy: {} });
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    Promise.all([
      getSunData(date, 47.6062, -122.3321),
      getSeattleTides(date),
    ]).then(([sunData, tideData]) => {
      if (tideData?.predictions?.length) {
        tideData.predictions = tideData.predictions.slice(0, 6); // Six is a nice number of data points for this chart
      }
      setData({ ...tideData, astronomy: sunData });
    });
  }, [date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + "T00:00:00");
    if (newDate.toString() !== "Invalid Date") {
      setDate(newDate);
    }
  };

  if (!data?.predictions?.length) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="date"
        className="mb-4 border border-gray-300 rounded-md py-1 px-2"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => handleDateChange(e)}
      />
      <EChart
        option={{
          textStyle: {
            fontFamily: "'Adobe Clean', sans-serif",
          },
          title: {
            text: `${dayIntl.format(date).toUpperCase()} | SEATTLE`,
            left: "left",
            textStyle: {
              fontSize: 32,
              fontWeight: "bold",
              color: "#333",
            },
            subtext: `sunrise ${hourIntl.format(
              new Date(data.astronomy.sunrise)
            )}   sunset ${hourIntl.format(new Date(data.astronomy.sunset))}`,
            subtextStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#666",
              align: "left",
              verticalAlign: "top",
            },
          },
          xAxis: {
            name: "Time",
            nameLocation: "middle",
            nameGap: 10,
            nameTextStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#666",
            },
            type: "time",
            splitNumber: 12,
            axisTick: false as any,
          },
          yAxis: {
            name: "Height (feet)",
            nameLocation: "middle",

            nameGap: 10,
            nameTextStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#666",
            },
          },
          animation: true,
          tooltip: {
            alwaysShowContent: true,
            trigger: "axis",
            formatter: (params: any) => {
              return `<strong>${
                params[0].value[2]
              }</strong><br />${fullIntl.format(
                new Date(params[0].value[0])
              )}<br />${params[0].value[1]} feet`;
            },
          },
          series: [
            {
              data: data?.predictions.map((event: any) => [
                new Date(event.t),
                Math.round(Number(event.v) * 10) / 10,
                event.type === "H" ? "High tide" : "Low tide",
              ]),
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
                  scaleX: 0.75,
                  scaleY: 0.75,
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
