require("dotenv").config();

const {
  uploadToImgbb,
  getBitcoinPrice,
  getBitcoinFees,
  btcLightning,
  getRandomTransactionDetails,
  getBiggestTransactionDetails,
  getTransactionWithMaxOutputs,
} = require("./modules/pag.js");

const { paintPrice, paintTransaction } = require("./create/canva.js");
const { commitMsg } = require("./modules/nostr.js");
const { fetchAllFeeds } = require("./modules/news.js");

async function text2img(msg) {
  const buffer = await paintPrice(msg);
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function text2img2(msg) {
  const buffer = await paintTransaction(msg);
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function handleNewsPost() {
  const posts = await fetchAllFeeds();
  const post = posts[Math.floor(Math.random() * posts.length)];
  await commitMsg(
    process.env.NSEC,
    `${post.title}   

     ${post.link} 
     
     #bitcoin #news`
  );
}

async function handleBitcoinPricePost() {
  const btcprice = await getBitcoinPrice();

  if (Math.random() > 0.7) {
    const sattousd = parseFloat(btcprice / 100000000).toFixed(6);
    await commitMsg(
      process.env.NSEC,
      `1 Bitcoin = ${btcprice} USD\n` +
        `1 Satoshi = ${sattousd} USD\n\n` +
        `#bitcoin #crypto`
    );
  } else {
    const msgurl = await text2img(`${btcprice}`);
    if (msgurl) {
      await commitMsg(
        process.env.NSEC,
        `Bitcoin:\n` +
          `${btcprice} USD\n\n` +
          `#bitcoin #crypto\n` +
          `${msgurl}`
      );
    }
  }
}

async function handleBiggestTransactionPost() {
  const biggestTx = await getBiggestTransactionDetails();
  await commitMsg(process.env.NSEC, `${biggestTx} #bitcoin #crypto #wallet`);
}

async function handleTransactionDetailsPost() {
  if (Math.random() > 0.5) {
    const randomTx = await getRandomTransactionDetails();
    await commitMsg(process.env.NSEC, `${randomTx} #bitcoin #crypto #wallet`);
  } else {
    const maxOutputsTx = await getTransactionWithMaxOutputs();
    await commitMsg(
      process.env.NSEC,
      `${maxOutputsTx} #bitcoin #crypto #wallet`
    );
  }
}

async function handleLightningNetworkPost() {
  const { node_count, channel_count, avg_capacity, total_capacity } =
    await btcLightning();

  await commitMsg(
    process.env.NSEC,
    `Bitcoin Lightning Network:\n\n` +
      `${node_count} Nodes\n` +
      `${channel_count} Channels\n` +
      `Avg capacity ${(avg_capacity / 100000000).toFixed(4)} BTC\n` +
      `Total capacity ${(total_capacity / 100000000).toFixed(4)} BTC\n\n` +
      `#bitcoin #lightning`
  );
}

async function handleBitcoinFeesPost() {
  const { fee, mempoolSize } = await getBitcoinFees();

  const msgurl = await text2img2(`${mempoolSize}`);

  if (msgurl) {
    await commitMsg(
      process.env.NSEC,
      `Bitcoin Fees:\n` +
      `Current Fee: ${fee} sat/vB\n` +
      `Mempool Size: ${mempoolSize} transactions pending\n\n` +
      `#bitcoin #fees\n` +
      `${msgurl}`
    );
  }
}

async function main() {
  const random = Math.floor(Math.random() * 10);

  try {
    switch (true) {
      case random < 2:
        await handleNewsPost();
        break;
      case random < 5:
        await handleBitcoinPricePost();
        break;
      case random < 7:
        await handleBiggestTransactionPost();
        break;
      case random < 8:
        await handleTransactionDetailsPost();
        break;
      case random < 9:
        await handleLightningNetworkPost();
        break;
      case random < 10:
        await handleBitcoinFeesPost();
        break;
      default:
        console.log("No matching case.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
