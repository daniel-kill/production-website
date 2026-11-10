#!/usr/bin/env python3
"""
Live RSS Aggregator Worker — danielkill.online
Runs via Python 3 on Hostinger CloudLinux
Usage: python3 scripts/rss_aggregator.py
"""
import os
import sys
import json
import sqlite3
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "feed_cache.sqlite")
JSON_PATH = os.path.join(DATA_DIR, "feed.json")

def find_node(parent, *tag_names):
    """Safely find the first matching XML child node without triggering truthiness deprecation warnings."""
    for tag in tag_names:
        found = parent.find(tag)
        if found is not None:
            return found
    return None

# Initialize SQLite database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS articles (
        guid TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        link TEXT NOT NULL,
        pub_date TEXT,
        source TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
""")
conn.commit()

FEEDS = [
    {"name": "Hacker News", "url": "https://news.ycombinator.com/rss"},
    {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml"},
    {"name": "TechCrunch", "url": "https://techcrunch.com/feed/"},
    {"name": "GitHub Blog", "url": "https://github.blog/feed/"},
    {"name": "Ars Technica", "url": "https://feeds.arstechnica.com/arstechnica/index"}
]

print(f"[{datetime.now().isoformat()}] Aggregating RSS feeds with Python...")

inserted_count = 0

for feed in FEEDS:
    try:
        req = urllib.request.Request(
            feed["url"],
            headers={
                "User-Agent": "DanielKill-FeedAggregator/1.0 (+https://danielkill.online/feed.php)",
                "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()

        root = ET.fromstring(content)
        # Handle standard RSS and Atom feeds
        items = root.findall(".//item")
        if not items:
            items = root.findall(".//{http://www.w3.org/2005/Atom}entry")

        feed_added = 0
        for item in items:
            # Title
            t_node = find_node(item, "title", "{http://www.w3.org/2005/Atom}title")
            title = t_node.text.strip() if t_node is not None and t_node.text else "Untitled"

            # Link
            l_node = find_node(item, "link", "{http://www.w3.org/2005/Atom}link")
            link = ""
            if l_node is not None:
                link = l_node.get("href") or l_node.text or ""
            link = link.strip()

            # GUID
            g_node = find_node(item, "guid", "id", "{http://www.w3.org/2005/Atom}id")
            guid = (g_node.text.strip() if g_node is not None and g_node.text else link) or link

            # PubDate
            d_node = find_node(item, "pubDate", "published", "{http://www.w3.org/2005/Atom}published", "{http://www.w3.org/2005/Atom}updated")
            pub_date = d_node.text.strip() if d_node is not None and d_node.text else datetime.now(timezone.utc).isoformat()

            if guid and link and title:
                cursor.execute(
                    "INSERT OR IGNORE INTO articles (guid, title, link, pub_date, source) VALUES (?, ?, ?, ?, ?)",
                    (guid, title, link, pub_date, feed["name"])
                )
                if cursor.rowcount > 0:
                    feed_added += 1

        conn.commit()
        print(f"[OK] {feed['name']}: {feed_added} new items (found {len(items)}).")
        inserted_count += feed_added

    except Exception as e:
        print(f"[WARN] Error fetching {feed['name']}: {e}")

# Export top 100 recent articles to static JSON for instant LiteSpeed caching
cursor.execute("SELECT guid, title, link, pub_date, source, created_at FROM articles ORDER BY rowid DESC LIMIT 100")
rows = cursor.fetchall()

articles_list = [
    {
        "guid": r[0],
        "title": r[1],
        "link": r[2],
        "pub_date": r[3],
        "source": r[4],
        "created_at": r[5]
    }
    for r in rows
]

export_data = {
    "updated_at": datetime.now(timezone.utc).isoformat(),
    "total": len(articles_list),
    "articles": articles_list
}

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(export_data, f, indent=2, ensure_ascii=False)

cursor.execute("SELECT COUNT(*) FROM articles")
total_articles = cursor.fetchone()[0]
conn.close()

print(f"[DONE] {inserted_count} new articles added. Total stored in database: {total_articles}.")
