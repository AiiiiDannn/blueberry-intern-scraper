// ui/src/lib/loadData.ts

/**
 * Load and parse JSONL (JSON Lines) file. Each line is a separate JSON object.
 * Return an array of parsed objects.
 */
export async function loadQuotes(): Promise<any[]> {
  // fetch the JSONL file served from /data/items.jsonl in the public folder
  const response = await fetch("/data/items.jsonl")

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`)
  }

  // get full file content as text
  const text = await response.text()

  // split file by newlines -> filter out empty lines -> parse JSON
  const lines = text
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => JSON.parse(l))

  console.log(`Loaded ${lines.length} quotes from JSONL`)
  return lines
}


// each line in .jsonl file = one JSON object
// we fetch it as text, split by '\n', and parse each line separately
// final result = array of quote objects [{text, author, tags, page_url}, ...]