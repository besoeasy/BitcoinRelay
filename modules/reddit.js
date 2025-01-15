const axios = require("axios");

const redditurls = ["https://api.reddit.com/r/Bitcoin/hot/.json", "https://api.reddit.com/r/Bitcoin/top/.json", "https://api.reddit.com/r/Bitcoin/new/.json"];

const getRandomRedditPost = async () => {
  try {
    const response = await axios.get(redditurls[Math.floor(Math.random() * redditurls.length)]);

    const posts = response.data.data.children;

    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const detailedPostResponse = await axios.get(`https://api.reddit.com${randomPost.data.permalink}.json`);
    const detailedPost = detailedPostResponse.data[0].data.children[0].data;

    const title = detailedPost.title;
    const description = detailedPost.selftext || null;
    
    const link = `https://www.reddit.com${randomPost.data.permalink}`;
    const images = detailedPost.url_overridden_by_dest ? [detailedPost.url_overridden_by_dest] : [];

    return {
      title,
      description,
      images,
      link,
    };
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    return null;
  }
};

async function hndl_reddit() {
  const post = await getRandomRedditPost();

  if (!post) {
    return;
  }

  let output = "";

  // Title
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

  output += "\n#reddit #bitcoin\n";
  output += `${post.link}\n`;

  return output;
}

module.exports = { hndl_reddit };
