# Blueberry AI SWE Intern Test

## Overview

A small full-stack project including:

- **scraper** (Python): crawls `https://quotes.toscrape.com`
- **ui** (React + Vite + TypeScript): displays scraped data interactively

## How to Run

### 1. Setup Scraper

```bash
cd blueberry-intern-scraper
conda create -n scraper python=3.10
conda activate scraper
pip install -r scraper/requirements.txt
python -m scraper.src.main --max-pages 10    # or any other numbers of pages you'd like
```

Output will be saved at:

```bash
scraper/data/items.jsonl
```

### 2. Run Frontend

Link data for the UI:

**For macOS/Linux**

```
ln -s ../../scraper/data ui/public/data
```

**For Windows (PowerShell)**

```
New-Item -ItemType SymbolicLink -Path "ui/public/data" -Target "..\..\scraper\data"
```

Then start the dev server:

```bash
cd ui
npm install
npm run dev
```

Visit: **[http://localhost:5173](http://localhost:5173)**

## Design Decisions

---

- **Separation of concerns:** scraper and UI are independent modules.
- **Scraper:** modularized into `fetcher`, `parser`, `pagination`, `robots`, `types`.
- **UI:** focuses on clear data flow and usability — built with `React + Vite`.
- **Visualization:** `Recharts` used for a simple bar chart.
- **Filtering / Sorting / Pagination:** all done client-side for speed and simplicity.

## What I'd Do With More Time

- Add loading spinners and error UI for the frontend.
- Allow front-end only feature that users can fetch the data only by opening the frontend interface
- Deploy frontend (e.g., Vercel) and backend scraper as API.
- Improve styling with Tailwind or Material UI, or at least with CSS.

## Known Limitations

- Scraper doesn’t handle author subpages (only quote list).
- No real-time re-fetching or backend API.
- Visualization is basic.
- Frontend filtering isn’t persisted across reloads.
