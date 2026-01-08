"use client";

import { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import { ScatterPlot, ScatterPlotCanvas } from "@nivo/scatterplot";
import { init, getInstanceByDom } from "echarts";
import { VegaEmbed } from "react-vega";

const numberOfPoints = 100000;

const data = Array.from({ length: numberOfPoints }, (_, index) => ({
  id: index,
  x: Math.random() * 1000,
  y: Math.random() * 1000,
}));

const dataSmall1000 = data.slice(0, 1000);
const dataSmall10000 = data.slice(0, 10000);
const dataMapped = data.map((d) => [d.x, d.y]);

const ObservablePlot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plot = Plot.plot({
      width: 1000,
      height: 1000,
      marks: [
        Plot.circle(data, {
          x: "x",
          y: "y",
          fill: "#4c78a8",
          r: 1,
        }),
      ],
    });
    containerRef.current && containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

const EChart = ({
  option,
  chartSettings,
  optionSettings,
  style = { width: "100%", height: "800px" },
  ...props
}: any) => {
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

export const MuchData = () => {
  const [showVegaPlot, setShowVegaPlot] = useState(true);
  const [showVegaPlotSvg, setShowVegaPlotSvg] = useState(false);
  const [showObservablePlot, setShowObservablePlot] = useState(false);
  const [showNivoPlot, setShowNivoPlot] = useState(false);
  const [showNivoPlotCanvas, setShowNivoPlotCanvas] = useState(false);
  const [showEChartsPlot, setShowEChartsPlot] = useState(false);
  const [showEChartsPlotCanvas, setShowEChartsPlotCanvas] = useState(false);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mt-8">Vega Lite (canvas)</h2>
        <p>Vega has no problem rendering this dataset in a canvas.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowVegaPlot(!showVegaPlot)}
        >
          {showVegaPlot ? "Hide Vega Plot" : "Show Vega Plot"}
        </button>
        {showVegaPlot && (
          <VegaEmbed
            options={{
              renderer: "canvas",
              width: 1000,
              height: 800,
            }}
            spec={{
              data: {
                values: data,
              },
              mark: {
                type: "circle",
                size: 10,
              },
              encoding: {
                x: { field: "x", type: "quantitative" },
                y: { field: "y", type: "quantitative" },
              },
            }}
          />
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mt-8">Vega Lite (svg)</h2>
        <p>
          Vega struggles on this dataset in SVG. Here&apos;s{" "}
          {dataSmall10000.length} points, which still makes my computer&apos;s
          fan go on overdrive.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowVegaPlotSvg(!showVegaPlotSvg)}
        >
          {showVegaPlotSvg ? "Hide Vega SVG" : "Show Vega SVG"}
        </button>
        {showVegaPlotSvg && (
          <VegaEmbed
            options={{
              renderer: "svg",
              width: 1000,
              height: 800,
            }}
            spec={{
              data: {
                values: dataSmall10000,
              },
              mark: {
                type: "circle",
                size: 10,
              },
              encoding: {
                x: { field: "x", type: "quantitative" },
                y: { field: "y", type: "quantitative" },
              },
            }}
          />
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mt-8">Observable Plot</h2>

        <p>
          Observable Plot uses SVG to render charts so there are actually{" "}
          {numberOfPoints} <code className="inline-block">&lt;circle&gt;</code>{" "}
          elements in the DOM. This doesn&apos;t scale super well, but it seems
          like Observable still handles this fairly well.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowObservablePlot(!showObservablePlot)}
        >
          {showObservablePlot ? "Hide Observable Plot" : "Show Observable Plot"}
        </button>
        {showObservablePlot && <ObservablePlot />}
      </div>

      <div>
        <h2 className="text-2xl font-bold mt-8">Nivo (svg)</h2>

        <p>
          Nivo&apos;s SVG implementation can&apos;t handle large datasets well.
          It&apos;s very slow and the browser will freeze. Here&apos;s{" "}
          {dataSmall1000.length} points instead, which is still pretty slow.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowNivoPlot(!showNivoPlot)}
        >
          {showNivoPlot ? "Hide Nivo SVG" : "Show Nivo SVG"}
        </button>
        {showNivoPlot && (
          <ScatterPlot
            width={1000}
            height={1000}
            data={[{ id: "data", data: dataSmall1000 }]}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            axisBottom={{ legend: "weight", legendOffset: 46 }}
            axisLeft={{ legend: "size", legendOffset: -60 }}
            isInteractive={false}
            nodeSize={4}
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mt-8">Nivo (canvas)</h2>
        <p>Much better.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowNivoPlotCanvas(!showNivoPlotCanvas)}
        >
          {showNivoPlotCanvas
            ? "Hide Nivo Plot Canvas"
            : "Show Nivo Plot Canvas"}
        </button>
        {showNivoPlotCanvas && (
          <ScatterPlotCanvas
            width={1000}
            height={1000}
            data={[{ id: "data", data: data }]}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            axisBottom={{ legend: "weight", legendOffset: 46 }}
            axisLeft={{ legend: "size", legendOffset: -60 }}
            nodeSize={2}
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mt-8">ECharts (svg)</h2>
        <p>ECharts seems ok in SVG.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowEChartsPlot(!showEChartsPlot)}
        >
          {showEChartsPlot ? "Hide ECharts SVG" : "Show ECharts SVG"}
        </button>
        {showEChartsPlot && (
          <EChart
            option={{
              xAxis: {},
              yAxis: {},
              animation: false,
              series: [{ data: dataMapped, type: "scatter", symbolSize: 2, animation: false }],
            }}
            chartSettings={{
              renderer: "svg",
              width: 1000,
              height: 800,
            }}
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mt-8">ECharts (canvas)</h2>
        <p>ECharts has no problem chewing through this dataset in a canvas.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowEChartsPlotCanvas(!showEChartsPlotCanvas)}
        >
          {showEChartsPlotCanvas
            ? "Hide ECharts Canvas"
            : "Show ECharts Canvas"}
        </button>
        {showEChartsPlotCanvas && (
          <EChart
            option={{
              xAxis: {},
              yAxis: {},
              animation: false,
              series: [{ data: dataMapped, type: "scatter", symbolSize: 2, animation: false }],
            }}
            chartSettings={{
              renderer: "canvas",
              width: 1000,
              height: 800,
            }}
          />
        )}
      </div>
    </div>
  );
};
