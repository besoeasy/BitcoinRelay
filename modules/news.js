import RSSParser from 'rss-parser';
const parser = new RSSParser();

// Use popular news aggregators with bitcoin keyword
const feedUrls = [
  // Yahoo News search for bitcoin
  'https://news.yahoo.com/rss/search?p=bitcoin',
  // Google News search for bitcoin
  'https://news.google.com/rss/search?q=bitcoin',
  // Bing News search for bitcoin
  'https://www.bing.com/news/search?q=bitcoin&format=rss',
  // Reuters search for bitcoin
  'https://www.reutersagency.com/feed/?best-topics=bitcoin&post_type=best',
  // Cointelegraph for redundancy
  'https://cointelegraph.com/rss',
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
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, '');
  });

  return allPosts[Math.floor(Math.random() * 15)];
}

async function hndl_news() {
  const { title, contentSnippet, link } = await fetchAllFeeds();

  const msg = `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n${link}`;

  return msg;
}

export {
  hndl_news,
};