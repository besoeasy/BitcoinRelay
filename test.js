const { fetchAllFeeds } = require("./modules/news.js");

async function test() {
  const post = await fetchAllFeeds();
  console.log(post);
}
test();
