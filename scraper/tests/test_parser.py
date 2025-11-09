# scraper/tests/test_parser.py
from pathlib import Path
from scraper.src.parser import parse_quotes


def test_parse_quotes_basic():
    # load fixture HTML file
    fixture_path = (
        Path(__file__).resolve().parent / "fixtures" / "sample_quote_page.html"
    )
    html = fixture_path.read_text(encoding="utf-8")

    # run the parser
    results = parse_quotes(html, "https://quotes.toscrape.com")

    # basic assertions
    assert isinstance(results, list)
    assert len(results) == 2

    first = results[0]
    assert "text" in first
    assert "author" in first
    assert "tags" in first
    assert first["author"] == "Albert Einstein"
    assert "thinking" in first["tags"]

    print("test_parse_quotes_basic passed")
