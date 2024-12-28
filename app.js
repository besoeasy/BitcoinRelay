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
      await commitMsg(
        process.env.NSEC,
        `${post.title} #bitcoin #news ${post.link}`
      );
      process.exit(0); // Exit after posting
      break;
    }

    case random < 6 && btcprice > 1: {
      const sattousd = parseFloat(btcprice / 100000000).toFixed(6);

      await commitMsg(
        process.env.NSEC,
        `1 Bitcoin = ${btcprice} USD, which means 1 Satoshi = ${sattousd} USD #bitcoin #crypto #trade`
      );
      process.exit(0); // Exit after posting
      break;
    }

    case random < 10: {
      const msgurl = await text2img(`${btcprice}`);
      if (msgurl) {
        await commitMsg(
          process.env.NSEC,
          `Bitcoin: ${btcprice} USD #bitcoin #crypto #trade ${msgurl}`
        );
      }
      process.exit(0); // Exit after posting
      break;
    }

    default:
      process.exit(0); // Exit if no case matches
      break;
  }
}

main();
