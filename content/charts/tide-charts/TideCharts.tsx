"use client";

import Link from "next/link";
import { EChartsOption, getInstanceByDom, init } from "echarts";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { getSeattleTides, getSunData } from "./util";
import wavesPattern from "./waves.png";

import "react-datepicker/dist/react-datepicker.css";

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
        tideData.predictions = tideData.predictions.slice(0, 5); // A nice number of data points for this chart
      }
      setData({ ...tideData, astronomy: sunData });
    });
  }, [date]);

  const handleDateChange = (e: Date) => {
    if (e.toString() !== "Invalid Date") {
      setDate(e);
    }
  };

  if (!data?.predictions?.length) return <div>Loading...</div>;

  return (
    <div>
      <DatePicker
        className="mb-4 border border-gray-300 rounded-md py-1 px-2"
        selected={date}
        onChange={(e: any) => handleDateChange(e)}
      />
      <EChart
        option={{
          textStyle: {
            fontFamily: "'Adobe Clean', sans-serif",
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: true,
              },
            },
          },
          title: {
            text: `${dayIntl.format(date).toUpperCase()} | SEATTLE`,
            left: "left",
            textStyle: {
              fontSize: 32,
              fontWeight: "bold",
              color: "#333",
            },
            subtext: `dawn ${hourIntl.format(
              new Date(data.astronomy.civil_twilight_begin)
            )}   sunrise ${hourIntl.format(
              new Date(data.astronomy.sunrise)
            )}   sunset ${hourIntl.format(
              new Date(data.astronomy.sunset)
            )}   dark ${hourIntl.format(
              new Date(data.astronomy.civil_twilight_end)
            )}`,
            subtextStyle: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#777",
              align: "left",
              verticalAlign: "top",
            },
          },
          xAxis: {
            name: "Time",
            nameLocation: "middle",
            nameGap: 10,

            type: "time",
            splitNumber: 12,
            axisTick: {
              show: true,
            },
            axisLabel: {
              formatter: {
                day: "{hh}\n\n{MMM} {d}",
                hour: "{hh}",
              },
            },
            axisLine: {
              onZero: false,
            },
          },
          yAxis: {
            name: "Height (feet)",
            nameLocation: "middle",
            nameGap: 10,
            minorSplitLine: {
              show: true,
            },
          },
          animation: true,
          tooltip: {
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
              label: {
                show: true,
                formatter: (params: any) => {
                  return `{footLabel|${
                    params.value[1]
                  } ft}\n (${hourIntl.format(new Date(params.value[0]))})`;
                },
                rich: {
                  footLabel: {
                    color: "#333",
                    fontSize: 14,
                    fontWeight: "900",
                  } as any,
                },
                color: "#555",
                backgroundColor: "rgba(255, 255, 255, 1)",
                padding: [5, 5],
                borderRadius: 5,
                borderWidth: 1,
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
              emphasis: {
                disabled: true,
                scale: false,
              },
              symbolSize: 0,
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

export { TideCharts };

export default function TideChartsPage() {
  return (
    <>
      <p className="text-base leading-7 mb-4 text-gray-700">
        I recently saw a beautiful{" "}
        <Link
          href="https://www.tidelog.com/product/puget-sound-2/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          TideLog
        </Link>{" "}
        book in a bookstore on Bainbridge Island. I wasn&apos;t able to fully
        replicate the gorgeous design that went into its charts, but I wanted to
        see if could make them interactive.
      </p>
      <p className="text-base leading-7 mb-4 text-gray-700">
        Uses NOAA&apos;s{" "}
        <Link
          href="https://api.tidesandcurrents.noaa.gov/api/prod/"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          tides and currents API
        </Link>{" "}
        to get data for the current day for Seattle.
      </p>
      <div className="min-h-[700px] w-full">
        <TideCharts />
      </div>
      <div className="mt-8" />
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
        Some takeaways:
      </h3>
      <ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
        <li className="pl-2 pt-2">
          Replicating a precise chart is pretty difficult and can require a lot
          of configuration
        </li>
        <li className="pl-2 pt-2">
          ECharts has a lot of functionality for design, but some is a little
          hard to find in the documentation
        </li>
      </ul>
    </>
  );
}
