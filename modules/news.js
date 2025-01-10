const RSSParser = require("rss-parser");

const parser = new RSSParser();

const { shorturl } = require("./urlshort.js");

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => ({
      title: item.title,
      contentSnippet: item.contentSnippet,
      link: item.link,
      pubDate: item.pubDate,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${url}:`, error.message);
    return [];
  }
}

async function fetchAllFeeds() {
  const newskeywords = ["bitcoin", "crypto", "blockchain"];

  const randomnewskeywords =
    newskeywords[Math.floor(Math.random() * newskeywords.length)];

  const allPosts = await fetchFeed(
    `https://www.bing.com/news/search?q=${randomnewskeywords}&format=rss`
  );

  allPosts.forEach((post) => {
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, "");
  });

  let posttosend = allPosts[Math.floor(Math.random() * 10)];

  posttosend.url = await shorturl(posttosend.link);

  return posttosend;
}

module.exports = {
  fetchAllFeeds,
};
