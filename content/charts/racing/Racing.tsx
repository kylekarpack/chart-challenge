"use client";

import { color } from "d3";
import { EChartsOption, getInstanceByDom, graphic, init } from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import bundesligaData from "./bundesliga_cumulative_goals.json";
import { TEAM_COLORS } from "./utils/team-colors";
import { TEAM_CRESTS } from "./utils/team-crests";

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

const Racing = () => {
	const teams = useMemo(
		() =>
			Object.keys(bundesligaData[0]).filter((key) => key !== "SeasonFrom"),
		[],
	);
	const [index, setIndex] = useState(0);
	const currentSeasonData = bundesligaData[index];
	const data = useMemo(
		() => teams.map((team) => (currentSeasonData as any)[team]),
		[currentSeasonData, teams],
	);

	const rich = useMemo(() => {
		return Object.fromEntries(
			teams.map((team, i) => [
				`t${i}`,
				{
					backgroundColor: {
						image: TEAM_CRESTS[team] || "",
					},
					height: 24,
					width: 24,
					align: "center",
				},
			]),
		);
	}, [teams]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIndex((prevIndex) => (prevIndex + 1) % bundesligaData.length);

		const interval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % bundesligaData.length);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const option: EChartsOption = useMemo(
		() => ({
			textStyle: {
				fontFamily: "'Adobe Clean', sans-serif",
			},
			grid: {
				top: 100,
			},
			title: {
				text: `Bundesliga All-Time Goal Total`,
				subtext: `Season: ${currentSeasonData.SeasonFrom}`,
				left: "left",
				textStyle: {
					fontSize: 24,
					fontWeight: "bold",
					color: "#333",
				},
				subtextStyle: {
					fontSize: 16,
					fontWeight: "normal",
					color: "#777",
				},
			},
			tooltip: {
				trigger: "axis",
			},
			xAxis: {
				max: "dataMax",
			},
			yAxis: {
				type: "category",
				data: teams,
				inverse: true,
				animationDuration: 300,
				animationDurationUpdate: 300,
				max: 15, // show top 15 teams
			},
			series: [
				{
					realtimeSort: true,
					name: "Total Goals",
					type: "bar",
					data: data,
					barCategoryGap: "15%",
					label: {
						show: true,
						position: "right",
						valueAnimation: true,
						formatter: (params: any) => {
							return `{t${params.dataIndex}|} ${params.value}`;
						},
						rich: rich as any,
					},
					itemStyle: {
						borderWidth: 1,
						color: (params: any) => {
							const teamName = teams[params.dataIndex];
							const baseColor = TEAM_COLORS[teamName] || "#4b5563";
							const brighterColor =
								color(baseColor)?.brighter(0.5).toString() || baseColor;
							return new graphic.LinearGradient(0, 0, 1, 0, [
								{
									offset: 0,
									color: baseColor,
								},
								{
									offset: 1,
									color: brighterColor,
								},
							]);
						},
					},
				},
			],
			legend: {
				show: false,
			},
			animationDuration: 0,
			animationDurationUpdate: 2000,
			animationEasing: "linear",
			animationEasingUpdate: "linear",
		}),
		[currentSeasonData.SeasonFrom, data, rich, teams],
	);

	return (
		<div>
			<EChart
				option={option}
				chartSettings={{
					renderer: "canvas",
					height: 800,
				}}
			/>
		</div>
	);
};

export default Racing;
