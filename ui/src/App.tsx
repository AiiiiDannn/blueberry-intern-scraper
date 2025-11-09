// ui/src/App.tsx

import React, { useEffect, useState } from "react";
import { loadQuotes } from "./lib/loadData";
import Table from "./components/Table";
import Filters from "./components/Filters";
import Chart from "./components/Chart";

export default function App() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // load JSONL data once on mount
  useEffect(() => {
    loadQuotes()
      .then((data) => {
        setQuotes(data);
        setFiltered(data); // start with all quotes
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading quotes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Blueberry Quotes Viewer 🫐🫐🫐🫐🫐🫐🫐🫐🫐🫐🫐🫐🫐🫐
      </h1>
      <p className="text-gray-500 mb-4">Loaded {quotes.length} quotes</p>
      {/* filter bar */}
      <Filters quotes={quotes} onFilter={setFiltered} />

      {/* table */}
      <Table quotes={filtered} />

      {/* chart */}
      <Chart quotes={filtered} />
    </div>
  );
}
