const RSSParser = require("rss-parser");
const parser = new RSSParser();

// List of RSS feed URLs
const feedUrls = [
  "https://cointelegraph.com/rss",
  "https://news.bitcoin.com/feed",
];

// Function to fetch and parse a single feed
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

// Main function to fetch all feeds and compile them into a JSON object
async function fetchAllFeeds() {
  const allPosts = [];

  for (const url of feedUrls) {
    const posts = await fetchFeed(url);
    allPosts.push(...posts);
  }

  // Optional: Sort posts by publication date
  allPosts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  allPosts.forEach((post) => {
    post.link = post.link.split("?")[0];
  });

  allPosts.forEach((post) => {
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, "");
  });

  return allPosts.slice(0, 7);
}

module.exports = {
  fetchAllFeeds,
};
