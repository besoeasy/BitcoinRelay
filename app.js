require("dotenv").config();

const { uploadToImgbb } = require("./modules/pag.js");

const { paintImg } = require("./create/canva.js");

const { commitMsg } = require("./modules/nostr.js");

const { getBitcoinPrice } = require("./modules/pag.js");

const { fetchAllFeeds } = require("./modules/news.js");

async function text2img(msg) {
  const buffer = await paintImg(msg);

  const msgurl = await uploadToImgbb(process.env.IMGBB_API_KEY, buffer);

  return msgurl || null;
}

async function main() {
  const random = parseInt(Math.floor(Math.random() * 10));

  if (random < 2) {
    const posts = await fetchAllFeeds();

    const post = posts[Math.floor(Math.random() * posts.length)];

    await commitMsg(
      process.env.NSEC,
      `${post.title}  #bitcoin #news ${post.link}`
    );

    return;
  }

  if (random < 6) {
    const btcprice = await getBitcoinPrice();

    if (msgurl) {
      await commitMsg(
        process.env.NSEC,
        `Bitcoin Is ${btcprice} USD  #bitcoin #crypto #trade`
      );
    }

    return;
  }

  if (random < 10) {
    const btcprice = await getBitcoinPrice();

    const msgurl = await text2img(`Bitcoin : ${btcprice} USD`);

    if (msgurl) {
      await commitMsg(
        process.env.NSEC,
        `Bitcoin : ${btcprice} USD   #bitcoin #crypto #trade ${msgurl}`
      );
    }

    return;
  }

  process.exit(0);
}

main();
