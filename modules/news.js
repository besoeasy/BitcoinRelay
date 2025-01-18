const RSSParser = require("rss-parser");
const parser = new RSSParser();

const feedUrls = [
  "https://cointelegraph.com/rss",
  "https://news.bitcoin.com/feed",
  "https://www.coindesk.com/arc/outboundfeeds/rss/",
  "https://bitcoinmagazine.com/feed",
  "https://decrypt.co/feed",
  "https://cryptoslate.com/feed/",
  "https://www.theblock.co/rss",
  "https://beincrypto.com/feed/",
];

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      source: feed.title,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${url}:`, error.message);
    return [];
  }
}

async function fetchAllFeeds() {
  const allPosts = [];

  for (const url of feedUrls) {
    const posts = await fetchFeed(url);
    allPosts.push(...posts);
  }

  allPosts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  allPosts.forEach((post) => {
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, "");
  });

  return allPosts[Math.floor(Math.random() * 15)];
}

async function hndl_news() {
  const { title, contentSnippet, link } = await fetchAllFeeds();

  const msg = `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n${link}`;

  return msg;
}

module.exports = {
  hndl_news,
};
