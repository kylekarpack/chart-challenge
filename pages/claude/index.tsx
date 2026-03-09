/* eslint-disable */

import { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import ChartPageLayout from "@/components/ChartPageLayout";
import Link from "next/link";
import Image from "next/image";

export const meta = {
  slug: "claude",
  title: "Claude",
  publishedAt: "2026-03-08",
  summary: "From a chat with a friend.",
} as const;

// Data compiled from BLS Consumer Expenditure Surveys & BLS Report 991 "100 Years of US Consumer Spending"
// Sparse historical surveys filled with interpolation between anchor points
const raw = [
  {
    year: 1901,
    Food: 42.5,
    Housing: 23.3,
    Apparel: 14.0,
    Transportation: 0,
    Healthcare: 0.5,
    Entertainment: 3.0,
    Other: 16.7,
  },
  {
    year: 1918,
    Food: 38.2,
    Housing: 27.0,
    Apparel: 16.5,
    Transportation: 4.0,
    Healthcare: 1.0,
    Entertainment: 3.5,
    Other: 9.8,
  },
  {
    year: 1935,
    Food: 33.6,
    Housing: 32.0,
    Apparel: 10.6,
    Transportation: 8.3,
    Healthcare: 2.5,
    Entertainment: 4.0,
    Other: 9.0,
  },
  {
    year: 1950,
    Food: 30.0,
    Housing: 27.0,
    Apparel: 12.0,
    Transportation: 13.5,
    Healthcare: 3.5,
    Entertainment: 4.5,
    Other: 9.5,
  },
  {
    year: 1960,
    Food: 25.0,
    Housing: 29.0,
    Apparel: 10.0,
    Transportation: 14.5,
    Healthcare: 4.8,
    Entertainment: 5.0,
    Other: 11.7,
  },
  {
    year: 1972,
    Food: 20.5,
    Housing: 30.5,
    Apparel: 7.5,
    Transportation: 19.0,
    Healthcare: 4.5,
    Entertainment: 6.5,
    Other: 11.5,
  },
  {
    year: 1984,
    Food: 16.2,
    Housing: 30.5,
    Apparel: 6.5,
    Transportation: 19.6,
    Healthcare: 5.3,
    Entertainment: 5.4,
    Other: 16.5,
  },
  {
    year: 1996,
    Food: 14.7,
    Housing: 32.5,
    Apparel: 5.5,
    Transportation: 18.7,
    Healthcare: 5.9,
    Entertainment: 5.4,
    Other: 17.3,
  },
  {
    year: 2002,
    Food: 13.5,
    Housing: 32.8,
    Apparel: 4.2,
    Transportation: 19.2,
    Healthcare: 6.1,
    Entertainment: 5.5,
    Other: 18.7,
  },
  {
    year: 2010,
    Food: 12.9,
    Housing: 34.4,
    Apparel: 3.3,
    Transportation: 17.1,
    Healthcare: 6.5,
    Entertainment: 5.4,
    Other: 20.4,
  },
  {
    year: 2015,
    Food: 12.7,
    Housing: 32.9,
    Apparel: 3.0,
    Transportation: 17.0,
    Healthcare: 8.0,
    Entertainment: 5.0,
    Other: 21.4,
  },
  {
    year: 2019,
    Food: 12.8,
    Housing: 32.8,
    Apparel: 2.6,
    Transportation: 16.0,
    Healthcare: 8.1,
    Entertainment: 4.9,
    Other: 22.8,
  },
  {
    year: 2020,
    Food: 11.7,
    Housing: 34.9,
    Apparel: 1.9,
    Transportation: 15.0,
    Healthcare: 8.1,
    Entertainment: 4.6,
    Other: 23.8,
  },
  {
    year: 2024,
    Food: 12.9,
    Housing: 33.4,
    Apparel: 2.5,
    Transportation: 17.0,
    Healthcare: 7.9,
    Entertainment: 4.6,
    Other: 21.7,
  },
];

// Interpolate between anchor years
function interpolate(data: string | any[]) {
  const out = [];
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i],
      b = data[i + 1];
    const steps = b.year - a.year;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const row = { year: a.year + s };
      for (const k of Object.keys(a)) {
        if (k !== "year")
          row[k as keyof typeof row] = +(
            a[k as keyof typeof a] +
            (b[k as keyof typeof b] - a[k as keyof typeof a]) * t
          ).toFixed(1);
      }
      out.push(row);
    }
  }
  out.push(data[data.length - 1]);
  return out;
}

const data = interpolate(raw);

const CATS = [
  "Food",
  "Housing",
  "Transportation",
  "Apparel",
  "Healthcare",
  "Entertainment",
  "Other",
];
const COLORS = {
  Food: "#22c55e",
  Housing: "#3b82f6",
  Transportation: "#f97316",
  Apparel: "#06b6d4",
  Healthcare: "#ef4444",
  Entertainment: "#eab308",
  Other: "#94a3b8",
};

const EVENTS = [
  { year: 1918, label: "WWI" },
  { year: 1929, label: "Great Depression" },
  { year: 1945, label: "WWII ends" },
  { year: 1973, label: "Oil Crisis" },
  { year: 2008, label: "Financial Crisis" },
  { year: 2020, label: "COVID-19" },
];

export default function Page() {
  const [mode, setMode] = useState("area");
  const [sel, setSel] = useState(new Set(CATS));
  const [hover, setHover] = useState(null);

  const toggle = (c: string) =>
    setSel((p) => {
      const n = new Set(p);
      n.has(c) ? n.size > 1 && n.delete(c) : n.add(c);
      return n;
    });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (!active || !payload?.length) return null;
    const items = [...payload]
      .filter((p) => sel.has(p.name))
      .sort((a, b) => b.value - a.value);
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 8,
          padding: "10px 14px",
          minWidth: 190,
        }}
      >
        <div
          style={{
            color: "#f59e0b",
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        {items.map((p) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              fontSize: 12,
              color: COLORS[p.name as keyof typeof COLORS],
              marginBottom: 2,
            }}
          >
            <span>{p.name}</span>
            <span style={{ fontWeight: 700 }}>{p.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  };

  const tickFilter = (v: number) => v % 20 === 0 || v === 1901 || v === 2024;

  return (
    <ChartPageLayout title={meta.title} publishedAt={meta.publishedAt}>
      <p className="text-base leading-7 mb-4 text-gray-700">
        I had an interesting chat with a friend this weekend about household
        spending by category. He went into Claude and immediately produced a
        compelling visualization:{" "}
        <Link
          href="https://claude.ai/public/artifacts/c4ebed8b-96f3-4974-8057-7ffca3acc3d7"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          https://claude.ai/public/artifacts/c4ebed8b-96f3-4974-8057-7ffca3acc3d7
        </Link>
        . <Image src="./claude-chart.png" alt="Claude 1" width={1000} height={1000} />
      </p>
      <p className="text-base leading-7 mb-4 text-gray-700">
        I tried to produce something on my corporate Claude account, but it was
        notably less compelling:{" "}
        <Link
          href="https://claude.ai/artifacts/27d13513-6914-4348-9c6d-1defc97b8e91"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          https://claude.ai/artifacts/27d13513-6914-4348-9c6d-1defc97b8e91
        </Link>. It's embedded below as well:
      </p>
      <div
        style={{
          background: "#0f172a",
          padding: "24px 20px",
          fontFamily: "system-ui, sans-serif",
          color: "#f1f5f9",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            130 Years of US Household Spending
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
            Share of total annual expenditures · BLS Consumer Expenditure
            Survey, 1901–2024
            <span style={{ color: "#475569", marginLeft: 8 }}>
              Dashed lines show major historical events
            </span>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["area", "line"].map((t) => (
                <button
                  key={t}
                  onClick={() => setMode(t)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    background: mode === t ? "#3b82f6" : "#1e293b",
                    color: mode === t ? "#fff" : "#94a3b8",
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(c)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 16,
                    border: `1.5px solid ${COLORS[c as keyof typeof COLORS]}`,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    background: sel.has(c)
                      ? COLORS[c as keyof typeof COLORS] + "30"
                      : "transparent",
                    color: sel.has(c)
                      ? COLORS[c as keyof typeof COLORS]
                      : "#475569",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: "16px 4px 8px",
            }}
          >
            <ResponsiveContainer width="100%" height={420}>
              {mode === "area" ? (
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3f55" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (tickFilter(v) ? v : "")}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    width={38}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip active={true} payload={[]} label="" />
                    }
                  />
                  {EVENTS.map((e) => (
                    <ReferenceLine
                      key={e.year}
                      x={e.year}
                      stroke="#f59e0b"
                      strokeDasharray="4 3"
                      strokeOpacity={0.5}
                      label={{
                        value: e.label,
                        position: "insideTopRight",
                        fill: "#f59e0b",
                        fontSize: 9,
                        angle: -90,
                        dx: 6,
                      }}
                    />
                  ))}
                  {CATS.filter((c) => sel.has(c)).map((c) => (
                    <Area
                      key={c}
                      type="monotone"
                      dataKey={c}
                      stackId="1"
                      stroke={COLORS[c as keyof typeof COLORS]}
                      fill={COLORS[c as keyof typeof COLORS]}
                      fillOpacity={0.75}
                      strokeWidth={1}
                      dot={false}
                    />
                  ))}
                </AreaChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3f55" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (tickFilter(v) ? v : "")}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    width={38}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip active={true} payload={[]} label="" />
                    }
                  />
                  {EVENTS.map((e) => (
                    <ReferenceLine
                      key={e.year}
                      x={e.year}
                      stroke="#f59e0b"
                      strokeDasharray="4 3"
                      strokeOpacity={0.5}
                      label={{
                        value: e.label,
                        position: "insideTopRight",
                        fill: "#f59e0b",
                        fontSize: 9,
                        angle: -90,
                        dx: 6,
                      }}
                    />
                  ))}
                  {CATS.filter((c) => sel.has(c)).map((c) => (
                    <Line
                      key={c}
                      type="monotone"
                      dataKey={c}
                      stroke={COLORS[c as keyof typeof COLORS]}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))",
              gap: 10,
            }}
          >
            {[
              {
                c: "#22c55e",
                title: "Food: 42.5% → 12.9%",
                desc: "The biggest shift of the century — mass agriculture and supply chains slashed food's share of the budget.",
              },
              {
                c: "#3b82f6",
                title: "Housing: 23% → 33%",
                desc: "Despite seeming higher, most of the rise reflects spending less on other basics, not housing becoming unaffordable in absolute terms.",
              },
              {
                c: "#f97316",
                title: "Transportation: 0% → 17%",
                desc: "Essentially a new category. Cars went from nonexistent to consuming 1 in 6 dollars spent.",
              },
              {
                c: "#ef4444",
                title: "Healthcare: ~0% → 8%",
                desc: "Modern medicine, insurance, and an aging population have made healthcare a major budget item since WWII.",
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  background: "#1e293b",
                  borderRadius: 8,
                  padding: "10px 14px",
                  borderLeft: `3px solid ${s.c}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: s.c,
                    marginBottom: 4,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "#334155", fontSize: 10, marginTop: 14 }}>
            Sources: BLS Consumer Expenditure Survey; BLS Report 991 "100 Years
            of U.S. Consumer Spending" (2006). Pre-2010 data from
            decennial/biennial surveys — years between are interpolated.
            Categories harmonized across eras; "Other" includes insurance,
            pensions, education, personal care, entertainment (pre-1950), and
            miscellaneous.
          </p>
        </div>
      </div>
    </ChartPageLayout>
  );
}
