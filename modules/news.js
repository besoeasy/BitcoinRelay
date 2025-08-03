import RSSParser from "rss-parser";
const parser = new RSSParser();

// Use Google News - the most popular and comprehensive news aggregator
const feedUrl = "https://news.google.com/rss/search?q=bitcoin";

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
  const posts = await fetchFeed(feedUrl);
  
  posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  posts.forEach((post) => {
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, "");
  });

  return posts[Math.floor(Math.random() * 15)];
}

async function hndl_news() {
  const { title, contentSnippet, link } = await fetchAllFeeds();

  const msg = `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n${link}`;

  return msg;
}

export { hndl_news };
