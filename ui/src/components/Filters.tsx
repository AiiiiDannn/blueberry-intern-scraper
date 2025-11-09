// ui/src/components/Filters.tsx
import React, { useState, useEffect } from "react";

/**
 * Filters component
 * allows searching quotes and filtering by tag
 */
export default function Filters({
  quotes,
  onFilter,
}: {
  quotes: any[];
  onFilter: (filtered: any[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // collect all unique tags from quotes
  const tags = Array.from(new Set(quotes.flatMap((q) => q.tags)));

  // filter quotes whenever user types or selects tag
  useEffect(() => {
    let filtered = quotes;

    // text search: check if text or author includes query
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.text.toLowerCase().includes(s) || q.author.toLowerCase().includes(s)
      );
    }

    // tag filter
    if (selectedTag !== "") {
      filtered = filtered.filter((q) => q.tags.includes(selectedTag));
    }

    onFilter(filtered);
  }, [search, selectedTag, quotes, onFilter]);

  return (
    <div className="flex gap-4 mb-4">
      {/* search box */}
      <input
        type="text"
        placeholder="Search quotes or authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-1/2"
      />

      {/* tag dropdown */}
      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

// build tag list from all quotes
// filter every time search or tag changes
// use useEffect so we don't need a "filter" button
