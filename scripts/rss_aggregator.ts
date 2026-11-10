/**
 * Live RSS Aggregator Worker — danielkill.online
 * Runs via Bun on Hostinger CloudLinux
 * Usage: bun scripts/rss_aggregator.ts
 */
import { Database } from "bun:sqlite";
import { resolve } from "path";

// Support both local repo and production server paths
const dbPath = process.env.FEED_DB_PATH || resolve(import.meta.dir, "../data/feed_cache.sqlite");
const jsonExportPath = resolve(import.meta.dir, "../data/feed.json");

const db = new Database(dbPath);

// Ensure schema
db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    guid TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    pub_date TEXT,
    source TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const FEEDS = [
  { name: "Hacker News", code: "hn", url: "https://news.ycombinator.com/rss" },
  { name: "BBC Technology", code: "bbc", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
  { name: "GitHub Blog", code: "github", url: "https://github.blog/feed/" },
  { name: "Ars Technica", code: "ars", url: "https://feeds.arstechnica.com/arstechnica/index" }
];

console.log(`[${new Date().toISOString()}] Aggregating RSS feeds...`);

let insertedTotal = 0;

for (const feed of FEEDS) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "DanielKill-FeedAggregator/1.0 (+https://danielkill.online/feed.php)",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[WARN] ${feed.name} returned HTTP ${res.status}`);
      continue;
    }

    const xml = await res.text();
    const itemRegex = /<item(?:[\s>][\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[0];

      // Extract title
      const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      let title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      title = title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x2F;/g, "/").replace(/&quot;/g, '"');

      // Extract link
      const linkMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i) ||
                        itemXml.match(/<link[^>]+href=["'](.*?)["']/i);
      const link = linkMatch ? linkMatch[1].trim() : "";

      // Extract guid
      const guidMatch = itemXml.match(/<guid[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i);
      const guid = (guidMatch ? guidMatch[1].trim() : link) || link;

      // Extract pubDate
      const dateMatch = itemXml.match(/<pubDate[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i) ||
                        itemXml.match(/<dc:date[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:date>/i);
      const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();

      if (guid && link && title) {
        const changes = db.prepare(
          "INSERT OR IGNORE INTO articles (guid, title, link, pub_date, source) VALUES (?, ?, ?, ?, ?)"
        ).run(guid, title, link, pubDate, feed.name);

        if (changes.changes > 0) count++;
      }
    }

    console.log(`[OK] ${feed.name}: ${count} new articles added.`);
    insertedTotal += count;
  } catch (err) {
    console.error(`[ERROR] Failed to fetch ${feed.name}:`, err);
  }
}

// Export top 100 recent articles to static JSON for instant LiteSpeed caching
try {
  const latestArticles = db.query(
    "SELECT guid, title, link, pub_date, source, created_at FROM articles ORDER BY rowid DESC LIMIT 100"
  ).all();

  const exportData = {
    updated_at: new Date().toISOString(),
    total: latestArticles.length,
    articles: latestArticles
  };

  await Bun.write(jsonExportPath, JSON.stringify(exportData, null, 2));
  console.log(`[OK] Exported ${latestArticles.length} articles to ${jsonExportPath}`);
} catch (exportErr) {
  console.error("[ERROR] Failed to export JSON snapshot:", exportErr);
}

const stats = db.query("SELECT COUNT(*) as total FROM articles").get() as { total: number };
console.log(`[DONE] ${insertedTotal} newly inserted. Total database archive: ${stats.total} articles.`);
