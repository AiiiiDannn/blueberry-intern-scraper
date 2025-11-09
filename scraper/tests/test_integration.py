# scraper/tests/test_integration.py

from scraper.src.fetcher import fetch_url
from scraper.src.parser import parse_quotes
from scraper.src.pagination import get_next_page


def test_integration_limited_crawl():
    """
    Simple integration test for fetcher + parser + pagination.
    Only fetches the first page from quotes.toscrape.com.
    """

    url = "https://quotes.toscrape.com/page/1/"
    html = fetch_url(url)

    assert html, "fetch_url() returned empty content"
    items = parse_quotes(html, url)

    # check if we extracted at least one quote
    assert len(items) > 0, "No quotes found on first page"
    assert "text" in items[0]
    assert "author" in items[0]
    assert "tags" in items[0]

    # test pagination
    next_page = get_next_page(html, url)
    assert next_page is not None, "Pagination failed to find next page"

    print(f"Found {len(items)} quotes, next page = {next_page}")
