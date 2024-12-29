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
const { plotData, getBTCData } = require("./create/chaw.js");

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

async function text2img3() {
  const buffer = await plotData();
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function handleBitcoinPriceChart() {
  const { data, minPrice, maxPrice, avgPrice } = await getBTCData();

  if (!data.length) return;
  const msgurl = await text2img3();

  if (msgurl) {
    await commitMsg(
      process.env.NSEC,
      `Bitcoin Price Action :\n` +
        `Min: ${minPrice} USD\n` +
        `Max: ${maxPrice} USD\n` +
        `Avg: ${avgPrice} USD\n\n` +
        `#bitcoin #crypto\n\n` +
        `${msgurl}`
    );
  }
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
        `Bitcoin: \n` +
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
  const random = Math.random();

  try {
    if (random < 0.125) {
      await handleNewsPost();
    } else if (random < 0.25) {
      await handleBitcoinPriceChart();
    } else if (random < 0.375) {
      await handleBitcoinPricePost();
    } else if (random < 0.5) {
      await handleBiggestTransactionPost();
    } else if (random < 0.625) {
      await handleTransactionDetailsPost();
    } else if (random < 0.75) {
      await handleLightningNetworkPost();
    } else if (random < 0.875) {
      await handleBitcoinFeesPost();
    } else {
      console.log("No action taken");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
