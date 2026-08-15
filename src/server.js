import express from 'express';
import { PlaywrightCrawler } from 'crawlee';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 3000);
const apiKey = process.env.API_KEY || '';

function requireApiKey(req, res, next) {
  if (!apiKey || req.header('x-api-key') !== apiKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'kyqra-crawler' });
});

app.post('/api/v1/crawl', requireApiKey, async (req, res) => {
  const { startUrls = [], maxRequestsPerCrawl = 25 } = req.body || {};
  if (!Array.isArray(startUrls) || startUrls.length === 0) {
    return res.status(400).json({ error: 'startUrls must be a non-empty array' });
  }

  const results = [];
  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: Number(maxRequestsPerCrawl),
    maxConcurrency: 3,
    requestHandlerTimeoutSecs: 60,
    async requestHandler({ request, page, enqueueLinks }) {
      const title = await page.title();
      const text = await page.locator('body').innerText().catch(() => '');
      results.push({ url: request.loadedUrl || request.url, title, text: text.slice(0, 5000) });
      await enqueueLinks({ strategy: 'same-domain' });
    }
  });

  try {
    await crawler.run(startUrls);
    res.json({ ok: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ ok: false, error: error?.message || 'crawl failed' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`kyqra crawler listening on ${port}`);
});
