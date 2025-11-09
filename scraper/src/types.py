# scraper/src/types.py
from typing import TypedDict, List


# define structured type for each scraped quote
class QuoteItem(TypedDict):
    text: str
    author: str
    tags: List[str]
    page_url: str
