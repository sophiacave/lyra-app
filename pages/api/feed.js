export default function handler(req, res) {
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Lyra Academy Blog</title>
    <link>https://likeone.ai/blog</link>
    <description>The latest news and tutorials from Lyra Academy.</description>
    <item>
      <title>Sample Blog Post</title>
      <link>https://likeone.ai/blog/sample-post</link>
      <pubDate>Tue, 01 Jan 2024 00:00:00 GMT</pubDate>
      <description>This is a sample blog post.</description>
    </item>
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml');
  res.status(200).send(feed);
}