# scraper/src/parser.py
from bs4 import BeautifulSoup
from .types import QuoteItem


def parse_quotes(content: str, page_url: str) -> list[QuoteItem]:
    """
    Parse quotes from the given HTML content.

    Args:
        content (str): The HTML content of the page.
        page_url (str): The URL of the page being parsed.

    Returns:
        list[QuoteItem]: A list of QuoteItem objects, each containing the text, author, tags, and page URL of a quote.
    """

    soup = BeautifulSoup(
        content, "html.parser"
    )  # parse the HTML content, using BeautifulSoup
    quotes = soup.select(".quote")  # select all quote blocks

    results = []

    for quote in quotes:
        # extract text, author, and tags
        text = quote.select_one(".text").get_text(strip=True)
        author = quote.select_one(".author").get_text(strip=True)
        tags = [t.get_text(strip=True) for t in quote.select(".tag")]

        item = {
            "text": text,
            "author": author,
            "tags": tags,
            "page_url": page_url,
        }  # create a small JSON object for each quote, now save data as a dictionary

        results.append(item)

    return results  # return a list of all quotes found on this page
