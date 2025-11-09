# scraper/main.py
import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path


def try_scrape_quotes():
    url = "https://quotes.toscrape.com"
    print(f"Fetching from: {url}")
    response = requests.get(url)  # send a GET request to the website
    response.raise_for_status()  # stop if status != 200

    soup = BeautifulSoup(
        response.text, "html.parser"
    )  # parse the HTML content, using BeautifulSoup
    quotes = soup.select(".quote")  # select all quote blocks

    # make sure data folder exists
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)

    output_path = data_dir / "items_test.jsonl"

    # write each quote as one JSON line
    with output_path.open("w", encoding="utf-8") as f:
        for quote in quotes:
            # extract text, author, and tags
            text = quote.select_one(".text").get_text(strip=True)
            author = quote.select_one(".author").get_text(strip=True)
            tags = [t.get_text(strip=True) for t in quote.select(".tag")]

            item = {
                "text": text,
                "author": author,
                "tags": tags,
                "page_url": url,
            }  # create a small JSON object for each quote

            f.write(
                json.dumps(item, ensure_ascii=False) + "\n"
            )  # write as a JSON line, avoid \uXXXX things with ensure_ascii=False

    print(f"Saved {len(quotes)} quotes to {output_path}")


if __name__ == "__main__":
    try_scrape_quotes()
