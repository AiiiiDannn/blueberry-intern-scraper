# scraper/src/fetcher.py
import requests
import time
from random import uniform
from .robots import is_allowed


# send HTTP GET request with delay and retry
def fetch_url(
    url: str, delay: float = 0.7, retries: int = 3, user_agent: str = "BlueberryBot/1.0"
) -> str:
    # Check robots.txt before requesting
    if not is_allowed(url, user_agent=user_agent):
        print(f"Skipping disallowed URL: {url}")
        return ""

    # wait politely before next request, adding some randomness to make it like a human (as recommended by GPT)
    sleep_time = uniform(delay * 0.8, delay * 1.2)
    time.sleep(sleep_time)

    headers = {"User-Agent": user_agent}

    for attempt in range(1, retries + 1):
        try:
            print(f"Fetching attempt ({attempt}/{retries}): {url}")
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # raise error if HTTP not 200
            return response.text

        except requests.RequestException as e:
            print(f"Attempt {attempt} failed: {e}")
            # exponential backoff before retry
            wait = min(5, 2**attempt)
            time.sleep(wait)

    print(f"Failed to fetch after {retries} retries: {url}")
    return ""
