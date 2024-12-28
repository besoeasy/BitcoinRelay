require("dotenv").config();

const { uploadToImgbb, getBitcoinPrice } = require("./modules/pag.js");
const { paintImg } = require("./create/canva.js");
const { commitMsg } = require("./modules/nostr.js");
const { fetchAllFeeds } = require("./modules/news.js");

async function text2img(msg) {
  const buffer = await paintImg(msg);
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function main() {
  const random = Math.floor(Math.random() * 10);
  const btcprice = await getBitcoinPrice();

  switch (true) {
    case random < 2: {
      const posts = await fetchAllFeeds();
      const post = posts[Math.floor(Math.random() * posts.length)];
      await commitMsg(process.env.NSEC, `${post.title} #bitcoin #news ${post.link}`);
      break;
    }

    case random < 6 && btcprice > 1: {
      await commitMsg(process.env.NSEC, `Bitcoin is ${btcprice} USD #bitcoin #crypto #trade`);
      break;
    }

    case random < 10: {
      const msgurl = await text2img(`Bitcoin: ${btcprice} USD`);
      if (msgurl) {
        await commitMsg(process.env.NSEC, `Bitcoin: ${btcprice} USD #bitcoin #crypto #trade ${msgurl}`);
      }
      break;
    }

    default:
      break;
  }
}

main();
