#!/usr/bin/env python3
"""Check server-rendered SEO on every sitemap URL; Python standard library only."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = ""
        self.canonicals = []
        self.alternates = {}
        self.meta = {}
        self.h1_count = 0
        self.title = ""
        self.schemas = []
        self.in_title = False
        self.in_schema = False
        self.schema_text = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang", "")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "title":
            self.in_title = True
        elif tag == "meta":
            self.meta[attrs.get("name", "").lower()] = attrs.get("content", "")
        elif tag == "link":
            if attrs.get("rel") == "canonical":
                self.canonicals.append(attrs.get("href", ""))
            if attrs.get("hreflang"):
                self.alternates[attrs["hreflang"]] = attrs.get("href", "")
        elif tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema_text = ""

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema_text += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_schema:
            self.schemas.append(json.loads(self.schema_text))
            self.in_schema = False


def normalized(url):
    return url.rstrip("/")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://localhost:3002")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    canonical_origin = "https://petty.im"

    def fetch(path):
        # No cookies or browser navigation headers: verify the crawler-facing HTML.
        request = Request(base + path, headers={"User-Agent": "Petty-SEO-Smoke/1.0"})
        with urlopen(request, timeout=30) as response:
            if normalized(response.url) != normalized(base + path):
                raise ValueError(f"unexpected redirect to {response.url}")
            return response.read().decode("utf-8"), response.headers

    sitemap, _ = fetch("/sitemap.xml")
    urls = [node.text for node in ET.fromstring(sitemap).findall("{*}url/{*}loc")]
    if not urls or len(urls) != len(set(urls)):
        raise ValueError("sitemap is empty or contains duplicate URLs")
    paths = []
    for url in urls:
        parsed = urlsplit(url)
        if f"{parsed.scheme}://{parsed.netloc}" != canonical_origin or parsed.query:
            raise ValueError(f"unexpected sitemap URL: {url}")
        paths.append(parsed.path or "/")

    def check(path):
        failures = []
        try:
            html, headers = fetch(path)
            page = Page()
            page.feed(html)
            expected_lang = {"/en": "en", "/ja": "ja"}.get(path, "ko")
            if page.lang != expected_lang:
                failures.append(f"html lang is {page.lang!r}, expected {expected_lang}")
            if page.h1_count != 1:
                failures.append(f"expected one H1, got {page.h1_count}")
            if not page.title.strip() or not page.meta.get("description", "").strip():
                failures.append("missing title or description")
            if len(page.canonicals) != 1 or normalized(page.canonicals[0]) != normalized(canonical_origin + path):
                failures.append(f"incorrect canonical: {page.canonicals}")
            robots = page.meta.get("robots", "") + "," + headers.get("X-Robots-Tag", "")
            if any(token.strip().lower() in {"noindex", "none", "nosnippet"} for token in robots.split(",")):
                failures.append("indexing or snippet blocked")
            landing = path in {"/", "/en", "/ja"}
            expected = {"ko-KR": canonical_origin, "x-default": canonical_origin}
            if landing:
                expected.update({"en-US": canonical_origin + "/en", "ja-JP": canonical_origin + "/ja"})
            else:
                expected = {key: canonical_origin + path for key in expected}
            if {key: normalized(value) for key, value in page.alternates.items()} != expected:
                failures.append(f"incorrect hreflang: {page.alternates}")
            if (landing or path.startswith("/alternatives")) and not page.schemas:
                failures.append("missing server-rendered JSON-LD")
        except Exception as error:
            failures.append(str(error))
        return path, failures

    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(check, paths))
    for path, failures in results:
        print(f"{'FAIL' if failures else 'PASS'} {path}" + (": " + "; ".join(failures) if failures else ""))
    errors = sum(bool(failures) for _, failures in results)
    print(f"{len(results) - errors}/{len(results)} sitemap pages passed ({base})")
    raise SystemExit(1 if errors else 0)


if __name__ == "__main__":
    main()
