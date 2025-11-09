# scraper/src/pagination.py
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def get_next_page(html: str, base_url: str):
    """
    Only responsible for finding the next page URL from the given HTML content.
    Args:
        html (str): The HTML content of the page.
        base_url (str): The base URL to resolve relative links.
    Returns:
        str or None: The URL of the next page, or None if no next page is found.
    """

    # parse HTML for pagination links
    soup = BeautifulSoup(html, "html.parser")

    # In the quotes.toscrape.com site, <li class="next"><a href="/page/2/">Next →</a></li>
    next_link = soup.select_one("li.next a")

    # if found, combine it with base_url to get full URL
    if next_link:
        next_url = urljoin(base_url, next_link["href"])
        return next_url

    return None  # no next page found
