# scraper/src/main.py
import requests
import time
import json
import click
from pathlib import Path

# import helper modules, which were available in the same folder
from .parser import parse_quotes
from .pagination import get_next_page


@click.command()
@click.option(
    "--start-url",
    default="https://quotes.toscrape.com",
    help="Starting URL for the crawl",
)
@click.option(
    "--max-pages", default=3, type=int, help="Maximum number of pages to scrape"
)
@click.option(
    "--delay-ms",
    default=700,
    type=int,
    help="Delay between requests, avoiding rate limits",
)
@click.option(
    "--dry-run", is_flag=True, help="Only log what would be scraped, don't save to file"
)
def main(start_url, max_pages, delay_ms, dry_run):
    # basic setup
    current_url = start_url
    all_items = []
    page_count = 0

    # make sure data folder exists
    data_dir = (
        Path(__file__).resolve().parents[1] / "data"
    )  # __file__ is the current file path, .resolve() gets absolute path, .parents[1] goes two levels up
    data_dir.mkdir(exist_ok=True)
    output_path = data_dir / "items.jsonl"

    print(f"Starting crawl from: {start_url}")

    # main crawling loop
    while (
        current_url and page_count < max_pages
    ):  # make sure we don't exceed max pages, and have a valid URL
        print(f"\nPage {page_count + 1}: {current_url}")

        # send GET request, trying to fetch the html content
        try:
            response = requests.get(current_url, timeout=10)
            response.raise_for_status()
        except requests.RequestException as e:  # stop if request fails
            print(f"Request failed: {e}")
            break

        content = response.text

        # parse quotes from this page
        items = parse_quotes(content, current_url)
        print(f"   found {len(items)} quotes")

        # collect and append parsed results
        all_items.extend(items)
        page_count += 1

        # find the next page URL (if any)
        next_url = get_next_page(content, current_url)
        current_url = next_url

        # wait politely before next request
        time.sleep(delay_ms / 1000)

        # if there is no next page, stop the loop
        if not next_url:
            print("No more pages found.")
            break

    # dry-run mode: show info but skip file writing
    if dry_run:
        print("\n--dry-run enabled, no file will be written.")
        print(f"Total pages visited: {page_count}")
        print(f"Total quotes collected: {len(all_items)}")
        return  # exit early

    # write all collected quotes to JSONL file
    with output_path.open("w", encoding="utf-8") as f:
        for item in all_items:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"\nDone! Saved {len(all_items)} quotes to {output_path}")


if __name__ == "__main__":
    # entry point of the scraper
    main()
