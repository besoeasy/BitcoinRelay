const axios = require("axios");

const redditurls = ["https://www.reddit.com/r/Bitcoin/hot/.json", "https://www.reddit.com/r/Bitcoin/top/.json", "https://www.reddit.com/r/Bitcoin/new/.json", "https://www.reddit.com/r/CryptoCurrency/hot/.json", "https://www.reddit.com/r/CryptoCurrency/top/.json", "https://www.reddit.com/r/CryptoCurrency/new/.json"];

const getRandomRedditPost = async () => {
  try {
    const response = await axios.get(redditurls[Math.floor(Math.random() * redditurls.length)], {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const posts = response.data.data.children;

    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const postUrl = `https://www.reddit.com${randomPost.data.permalink}`;

    const detailedPostResponse = await axios.get(
      `${postUrl}.json`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.3029.110 Safari/537.3",
        },
      }
    );
    const detailedPost = detailedPostResponse.data[0].data.children[0].data;

    // Extract title, description, images, and other details
    const title = detailedPost.title;
    const description = detailedPost.selftext || null;
    const link = postUrl;
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

// Function to handle and format the output of the selected post
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
