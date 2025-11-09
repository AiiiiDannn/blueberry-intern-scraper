// ui/src/components/Chart.tsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * Chart component
 * visualize number of quotes per author
 */
export default function Chart({ quotes }: { quotes: any[] }) {
  // useMemo → only recalc when quotes change
  const data = useMemo(() => {
    const countMap: Record<string, number> = {};

    // count number of quotes per author
    for (const q of quotes) {
      countMap[q.author] = (countMap[q.author] || 0) + 1;
    }

    // convert to array for recharts
    return Object.entries(countMap).map(([author, count]) => ({
      author,
      count,
    }));
  }, [quotes]);

  // no data case
  if (!data.length) {
    return <p>No data to show 📉</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Quotes per Author (Top {data.length})
      </h2>

      {/* responsive container adjusts to parent width */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
          barCategoryGap={data.length < 5 ? "60%" : "20%"} // adjust spacing between bars
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="author" angle={-25} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#4F46E5"
            barSize={60}
            radius={[4, 4, 0, 0]} // rounded top corners for style
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// useMemo -> prevents recalculating counts every render
// Object.entries -> convert map to array for Recharts
// ResponsiveContainer -> auto-fit for all screen sizes
