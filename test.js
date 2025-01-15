const redditurls = ["https://www.reddit.com/r/Bitcoin/hot/.json"];
const axios = require("axios");

const getRedditData = async () => {
  // Fetch data from all the Reddit URLs concurrently
  const data = await Promise.all(
    redditurls.map(async (url) => {
      const response = await axios.get(url);
      return response.data;
    })
  );

  // Combine all posts from the fetched data into a single array
  const allPosts = data.flatMap((subredditData) => subredditData.data.children);

  // Randomly pick a post from the combined array
  const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];

  // Extract the title, description, images (if any), and the link to the Reddit post
  const title = randomPost.data.title;
  const description = randomPost.data.selftext || null;
  const link = `https://www.reddit.com${randomPost.data.permalink}`;
  const images = randomPost.data.url_overridden_by_dest ? [randomPost.data.url_overridden_by_dest] : [];

  return {
    title,
    description,
    images,
    link,
  };
};

async function hndl_reddit() {
  const post = await getRedditData();

  let output = "";

  output += post.title + "\n";

  if (post.description) {
    output += post.description + "\n";
  }

  if (post.images.length > 0) {
    post.images.forEach((img) => (output += img + "\n"));
  }

  output += post.link + "\n";

  return output;
}

async function main() {
  const redditData = await hndl_reddit();
  console.log(redditData);
}

main();
