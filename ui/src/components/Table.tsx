// ui/src/components/Table.tsx
import React, { useState, useMemo } from "react";

/**
 * Table component
 * supports sorting and client pagination
 */
export default function Table({ quotes }: { quotes: any[] }) {
  const [sortKey, setSortKey] = useState<"text" | "author" | "tags" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const pageSize = 10; // items per page

  // handle column sorting
  const handleSort = (key: "text" | "author" | "tags") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // sorted quotes
  const sortedQuotes = useMemo(() => {
    if (!sortKey) return quotes;
    const sorted = [...quotes].sort((a, b) => {
      let valA = "";
      let valB = "";
      if (sortKey === "tags") {
        valA = a.tags.join(", ");
        valB = b.tags.join(", ");
      } else {
        valA = a[sortKey] || "";
        valB = b[sortKey] || "";
      }
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
    return sorted;
  }, [quotes, sortKey, sortOrder]);

  // pagination logic
  const totalPages = Math.ceil(sortedQuotes.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paginatedQuotes = sortedQuotes.slice(startIdx, startIdx + pageSize);

  // navigation handlers
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // reset to first page when quotes change
  React.useEffect(() => {
    setPage(1);
  }, [quotes]);

  if (quotes.length === 0)
    return <p className="text-gray-500">No quotes found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="cursor-pointer p-2 border-b"
              onClick={() => handleSort("text")}
            >
              Quote{" "}
              {sortKey === "text" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="cursor-pointer p-2 border-b"
              onClick={() => handleSort("author")}
            >
              Author{" "}
              {sortKey === "author" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="cursor-pointer p-2 border-b"
              onClick={() => handleSort("tags")}
            >
              Tags {sortKey === "tags" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedQuotes.map((q, i) => (
            <tr
              key={i}
              className="border-t hover:bg-gray-50"
              onClick={() => setSelectedQuote(q)}
            >
              <td className="p-2">{q.text}</td>
              <td className="p-2">{q.author}</td>
              <td className="p-2">{q.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        <span className="text-gray-600">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* detail panel */}
      {selectedQuote && (
        <div className="mt-6 border-t pt-4 bg-gray-50 p-3 rounded-lg">
          <h3 className="font-semibold text-lg mb-1">Quote Details</h3>
          <p className="italic mb-2">"{selectedQuote.text}"</p>
          <p>
            <strong>Author:</strong> {selectedQuote.author}
          </p>
          <p>
            <strong>Tags:</strong> {selectedQuote.tags.join(", ")}
          </p>
          {selectedQuote.page_url && (
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={selectedQuote.page_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                {selectedQuote.page_url}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// useMemo -> only sort when data or sort state changes
// slice() -> selects current page items
// reset page to 1 when filters/search results change
// handlePrev/Next -> clamp between 1 and totalPages
