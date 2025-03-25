import RSSParser from 'rss-parser';
const parser = new RSSParser();

const feedUrls = [
  'https://cointelegraph.com/rss',                  // Broad crypto news and trends
  'https://news.bitcoin.com/feed',                 // Bitcoin-focused news
  'https://www.coindesk.com/arc/outboundfeeds/rss/', // Industry-leading crypto journalism
  'https://bitcoinmagazine.com/feed',              // Bitcoin-specific insights
  'https://decrypt.co/feed',                       // Crypto and blockchain news
  'https://cryptoslate.com/feed/',                 // Market analysis and crypto updates
  'https://www.theblock.co/rss',                   // Deep dives into crypto markets
  'https://beincrypto.com/feed/',                  // Independent crypto news
  'https://cryptobriefing.com/feed/',              // In-depth crypto analysis
  'https://coingape.com/feed/',                    // Breaking news and price updates
  'https://u.today/rss',                           // Daily crypto news and opinions
  'https://www.newsbtc.com/feed/',                 // Bitcoin and altcoin focus
  'https://www.blockchain.news/feed',              // Blockchain and crypto coverage
  'https://coinspectator.com/feed/',               // Real-time news aggregation
  'https://crypto.news/feed/',                     // Crypto and Web3 updates
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