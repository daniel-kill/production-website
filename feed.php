<?php
/**
 * Live Tech & Dev Feed — danielkill.online
 * Maintainer: Daniel Kill <daniel@danielkill.online>
 */
require_once __DIR__ . '/config.php';
recordTelemetry($_SERVER['REQUEST_URI'] ?? '/feed.php');

// Locate SQLite database
$dbPaths = [
    __DIR__ . '/data/feed_cache.sqlite',
    '/home/u922787661/data/feed_cache.sqlite',
    sys_get_temp_dir() . '/feed_cache.sqlite'
];

$db = null;
foreach ($dbPaths as $path) {
    if (file_exists($path)) {
        try {
            $db = new PDO('sqlite:' . $path, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            break;
        } catch (Exception $e) {
            continue;
        }
    }
}

// Filter parameter
$selectedSource = isset($_GET['source']) ? trim((string)$_GET['source']) : '';
$format = isset($_GET['format']) ? strtolower(trim((string)$_GET['format'])) : 'html';

// Fetch articles
$articles = [];
$totalCount = 0;
$sources = [];

if ($db) {
    try {
        // Get source list
        $srcStmt = $db->query("SELECT source, COUNT(*) as count FROM articles GROUP BY source ORDER BY count DESC");
        $sources = $srcStmt->fetchAll();

        // Get total count
        $cntStmt = $db->query("SELECT COUNT(*) FROM articles");
        $totalCount = (int)$cntStmt->fetchColumn();

        // Query articles
        if (!empty($selectedSource)) {
            $stmt = $db->prepare("SELECT guid, title, link, pub_date, source, created_at FROM articles WHERE source = ? ORDER BY rowid DESC LIMIT 80");
            $stmt->execute([$selectedSource]);
        } else {
            $stmt = $db->query("SELECT guid, title, link, pub_date, source, created_at FROM articles ORDER BY rowid DESC LIMIT 80");
        }
        $articles = $stmt->fetchAll();
    } catch (Exception $e) {
        $articles = [];
    }
}

// Fallback to static JSON cache if database empty or unavailable
if (empty($articles) && file_exists(__DIR__ . '/data/feed.json')) {
    $jsonRaw = file_get_contents(__DIR__ . '/data/feed.json');
    $jsonData = json_decode($jsonRaw, true);
    if (!empty($jsonData['articles'])) {
        $articles = $jsonData['articles'];
        $totalCount = count($articles);
        if (!empty($selectedSource)) {
            $articles = array_filter($articles, function ($a) use ($selectedSource) {
                return ($a['source'] ?? '') === $selectedSource;
            });
        }
    }
}

// JSON Export API
if ($format === 'json') {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=180');
    echo json_encode([
        'source' => 'danielkill.online Live Feed',
        'generated_at' => gmdate('c'),
        'filter' => $selectedSource ?: 'all',
        'total' => count($articles),
        'articles' => $articles
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Relative time helper
function timeAgo($dateStr) {
    $time = strtotime($dateStr);
    if (!$time) return htmlspecialchars($dateStr);
    $diff = time() - $time;
    if ($diff < 60) return 'just now';
    if ($diff < 3600) return floor($diff / 60) . 'm ago';
    if ($diff < 86400) return floor($diff / 3600) . 'h ago';
    if ($diff < 604800) return floor($diff / 86400) . 'd ago';
    return date('M j, Y', $time);
}

// Source class helper
function sourceClass($sourceName) {
    $s = strtolower(trim($sourceName));
    if (strpos($s, 'hacker') !== false) return 'hacker-news';
    if (strpos($s, 'verge') !== false) return 'the-verge';
    if (strpos($s, 'crunch') !== false) return 'techcrunch';
    if (strpos($s, 'github') !== false) return 'github-blog';
    if (strpos($s, 'ars') !== false) return 'ars-technica';
    return 'default-source';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1020">
  <meta name="description" content="Live Tech & Developer Dispatch aggregated by Daniel Kill. Real-time RSS feeds from Hacker News, The Verge, TechCrunch, GitHub, and Ars Technica.">
  <meta property="og:title" content="Live Tech & Dev Feed — Daniel Kill">
  <meta property="og:description" content="Real-time automated developer and tech journalism aggregation powered by Bun and SQLite.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://danielkill.online/feed.php">
  <meta property="og:image" content="images/daniel%40danielkill.online_AVATAR.png">
  
  <title>Live Tech &amp; Dev Feed — Daniel Kill</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate" type="application/json" title="Live Feed JSON" href="feed.php?format=json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="feed.css">
</head>
<body>
  <div class="wrap">
    <header class="nav">
      <a class="wordmark" href="index.php" aria-label="Daniel Kill home">DK<span>.</span></a>
      <nav class="nav-links">
        <a href="index.php#projects">Projects</a>
        <a href="feed.php" class="nav-highlight">Feed <span class="badge-tag">Live</span></a>
        <a href="games.php">Games <span class="badge-tag">Playable</span></a>
        <a href="index.php#discord">Discord</a>
        <a href="index.php#contact">Contact</a>
      </nav>
      <div class="nav-note">
        <span class="dot" aria-hidden="true"></span>
        <span>danielkill.online · Active</span>
      </div>
    </header>

    <main>
      <section class="feed-hero">
        <div class="feed-badge-pulse">
          <span class="feed-pulse-dot" aria-hidden="true"></span>
          <span>Automated Server Pipeline · Bun + SQLite</span>
        </div>
        <h1>Live Tech &amp; Dev Feed</h1>
        <p class="lead">Curated real-time RSS dispatches and breaking technology stories aggregated directly on Hostinger using lightweight server-side Bun background workers.</p>

        <div class="actions">
          <a class="btn" href="feed.php?format=json" target="_blank" rel="noopener noreferrer">
            <span>{ } Direct JSON API</span> <span aria-hidden="true">↗</span>
          </a>
          <a class="btn" href="index.php">
            <span>← Back to Portfolio</span>
          </a>
          <a class="btn" href="games.php">
            <span>🎮 Play Retro Arcade</span> <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <!-- Source Filter Navigation -->
      <nav class="feed-filter-bar" aria-label="Filter by Feed Source">
        <a class="feed-filter-btn <?= empty($selectedSource) ? 'active' : '' ?>" href="feed.php">
          All Sources (<?= $totalCount ?>)
        </a>
        <?php foreach ($sources as $src): ?>
          <a class="feed-filter-btn <?= $selectedSource === $src['source'] ? 'active' : '' ?>" 
             href="feed.php?source=<?= urlencode($src['source']) ?>">
            <?= htmlspecialchars($src['source']) ?> (<?= $src['count'] ?>)
          </a>
        <?php endforeach; ?>
      </nav>

      <!-- Articles Grid -->
      <section class="feed-grid" aria-label="Aggregated Articles">
        <?php if (empty($articles)): ?>
          <div class="card" style="text-align:center;padding:40px 20px;">
            <h3>Aggregating Initial Feeds...</h3>
            <p class="muted">The worker script is currently caching the latest dispatches. Refresh in a few moments.</p>
          </div>
        <?php else: ?>
          <?php foreach ($articles as $item): ?>
            <article class="feed-card">
              <div class="feed-top">
                <span class="source-tag <?= sourceClass($item['source'] ?? '') ?>">
                  <?= htmlspecialchars($item['source'] ?? 'News') ?>
                </span>
                <time class="feed-date" datetime="<?= htmlspecialchars($item['pub_date'] ?? '') ?>">
                  <?= timeAgo($item['pub_date'] ?? '') ?>
                </time>
              </div>
              <h2 class="feed-title">
                <a href="<?= htmlspecialchars($item['link'] ?? '#') ?>" target="_blank" rel="noopener noreferrer">
                  <span><?= htmlspecialchars($item['title'] ?? 'Untitled') ?></span>
                  <span class="feed-arrow" aria-hidden="true">↗</span>
                </a>
              </h2>
            </article>
          <?php endforeach; ?>
        <?php endif; ?>
      </section>

      <div class="feed-footer-stats">
        <span>Displaying <code><?= count($articles) ?></code> stories from <code><?= $totalCount ?></code> indexed articles in local SQLite cache.</span>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-copy">
        <span>© <span id="year"><?= date('Y') ?></span> Daniel Kill. All rights reserved.</span>
        <span class="footer-domain">danielkill.online</span>
      </div>
      <div class="actions" style="gap:14px;justify-content:flex-end;flex-wrap:wrap;">
        <a href="feed.php">Feed ↗</a>
        <a href="games.php">Games ↗</a>
        <a href="https://github.com/daniel-kill?tab=repositories" target="_blank" rel="noopener noreferrer">Repositories ↗</a>
        <a href="https://discord.gg/muPYhD7MEM" target="_blank" rel="noopener noreferrer">Discord ↗</a>
      </div>
    </footer>
  </div>

  <script src="script.js" defer></script>
</body>
</html>
