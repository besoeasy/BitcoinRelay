const axios = require("axios");
const Parser = require("rss-parser");
const parser = new Parser();

const redditRssUrls = [
  "https://www.reddit.com/r/Bitcoin/.rss",           // Bitcoin general feed
  "https://www.reddit.com/r/Bitcoin/top/.rss",      // Bitcoin top posts
  "https://www.reddit.com/r/Bitcoin/hot/.rss",      // Bitcoin trending posts
  "https://www.reddit.com/r/CryptoCurrency/.rss",   // Broad crypto news and discussion
  "https://www.reddit.com/r/Ethereum/.rss",         // Ethereum-specific updates
  "https://www.reddit.com/r/BTC/.rss",              // Bitcoin alternative community
  "https://www.reddit.com/r/CryptoMarkets/.rss",    // Market-focused crypto news
  "https://www.reddit.com/r/Crypto_General/.rss",   // General crypto topics
  "https://www.reddit.com/r/Altcoin/.rss",          // Altcoin news and updates
  "https://www.reddit.com/r/Blockchain/.rss",       // Blockchain tech and crypto overlap
];

const getRandomRedditPostFromRss = async () => {
  try {
    const rssUrl = redditRssUrls[Math.floor(Math.random() * redditRssUrls.length)];
    const feed = await parser.parseURL(rssUrl);

    if (!feed.items || feed.items.length === 0) {
      throw new Error("No posts found in RSS feed.");
    }

    const randomPost = feed.items[Math.floor(Math.random() * feed.items.length)];

    const title = randomPost.title;
    const description = randomPost.contentSnippet || randomPost.content || null;
    const link = randomPost.link;
    const images = [];

    if (randomPost.content) {
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      while ((match = imgRegex.exec(randomPost.content)) !== null) {
        images.push(match[1]);
      }
    }

    return {
      title,
      description,
      images,
      link,
    };
  } catch (error) {
    console.error("Error fetching Reddit RSS feed:", error);
    return null;
  }
};

async function hndl_reddit() {
  const post = await getRandomRedditPostFromRss();

  if (!post) {
    return;
  }

  let output = "";

  output += `${post.title}\n`;

  if (post.description) {
    output += `${post.description}\n`;
  }

  if (post.images.length > 0) {
    post.images.forEach((img) => {
      if (/\.(jpeg|jpg|gif|png)$/i.test(img)) {
        output += `${img}\n`;
      }
    });
  }

  output += "\n#reddit #bitcoin #news #crypto\n";
  output += `${post.link}\n`;

  return output;
}

module.exports = { hndl_reddit };
