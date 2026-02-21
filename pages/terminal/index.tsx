"use client";

import ChartPageLayout from "@/components/ChartPageLayout";
import Image from "next/image";
import Link from "next/link";

export const meta = {
	slug: "terminal",
	title: "Terminal Charts",
	publishedAt: "2026-02-21",
	summary: "A bizzare experient in terminal-based data visualization",
} as const;

export default function Page() {
	return (
		<ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
			<p className="text-base leading-7 mb-4 text-gray-700">
				Terminal applications are so hot right now, so I decided to make my own.
				Using{" "}
				<Link
					className="text-blue-600 hover:underline"
					href="https://github.com/ratatui-org/ratatui">
					Ratatui
				</Link>{" "}
				and Rust, I built a tiny application that can display basic bar charts
				in the terminal.
			</p>

			<p className="text-base leading-7 mb-4 text-gray-700">
				If you feel absolutely compelled to try this, you can find the source
				code{" "}
				<Link
					className="text-blue-600 hover:underline"
					href="https://github.com/kylekarpack/chart-a-tui">
					here
				</Link>
				.
			</p>

			<Image
				src="/images/terminal-charts.png"
				alt="Terminal Charts"
				className="m-auto"
				width={800}
				height={500}
			/>

			<h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">
				Takeaways:
			</h3>
			<ul className="list-disc ml-8 mb-2 space-y-1 text-gray-700">
				<li className="pl-2 pt-2">This is absolutely silly</li>
				<li className="pl-2 pt-2">Don&apos;t do this</li>
				<li className="pl-2 pt-2">But... maybe someday?</li>
			</ul>
		</ChartPageLayout>
	);
}
