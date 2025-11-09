# scraper/src/robots.py
from urllib.robotparser import RobotFileParser
from urllib.parse import urlparse
from functools import lru_cache


# cache robot rules to avoid re-fetching for same domain
@lru_cache(maxsize=20)
def get_robot_parser(base_url: str) -> RobotFileParser:
    """
    Fetch and parse robots.txt for a given base domain.
    Cache results to avoid duplicate downloads.
    """
    parsed = urlparse(base_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"

    rp = RobotFileParser()
    rp.set_url(robots_url)
    try:
        rp.read()
        print(f"Loaded robots.txt from {robots_url}")
    except Exception:
        print(f"Could not read robots.txt: {robots_url}")
    return rp


def is_allowed(url: str, user_agent: str = "BlueberryBot/1.0") -> bool:
    """
    Return True if the given URL is allowed for this user-agent.
    """
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    rp = get_robot_parser(base_url)
    allowed = rp.can_fetch(user_agent, url)

    if not allowed:
        print(f"Disallowed by robots.txt: {url}")
    return allowed
