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

async function imgPrice(msg) {
  const buffer = await paintPrice(msg);
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function imgPending(msg) {
  const buffer = await paintTransaction(msg);
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function imgChart() {
  const buffer = await plotData();
  return uploadToImgbb(process.env.IMGBB_API_KEY, buffer) || null;
}

async function handleBitcoinPriceChart() {
  const { data, minPrice, maxPrice, avgPrice } = await getBTCData();

  if (!data.length) return;
  const msgurl = await imgChart();

  if (msgurl) {
    await commitMsg(
      process.env.NSEC,
      `Bitcoin Price Action :\n\n` +
        `Min: ${minPrice} USD\n` +
        `Max: ${maxPrice} USD\n` +
        `Avg: ${avgPrice} USD\n` +
        `\n\n#bitcoin #crypto #trade\n\n` +
        `${msgurl}`
    );
  }
}

async function handleNewsPost() {
  const post = await fetchAllFeeds();

  console.log(post);

  await commitMsg(
    process.env.NSEC,
    `${post.title}    

     ${post.contentSnippet} 

🔗   *Read more:* ${post.link}  
   
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
        `1 Satoshi = ${sattousd} USD\n` +
        `\n\n#bitcoin #crypto #trade`
    );
  } else {
    const msgurl = await imgPrice(`${btcprice}`);

    const usdname = [
      "US Dollars",
      "USD",
      "United States Dollars",
      "American Dollars",
    ];

    const usd = usdname[Math.floor(Math.random() * usdname.length)];

    if (msgurl) {
      await commitMsg(
        process.env.NSEC,
        `Bitcoin: ${btcprice} ${usd}` + `\n\n #bitcoin #crypto` + `\n ${msgurl}`
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

  const msgurl = await imgPending(`${mempoolSize}`);

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
  const random = Math.floor(Math.random() * 6);

  try {
    if (random === 0) {
      await handleNewsPost();
    }
    if (random === 1) {
      await handleBitcoinPriceChart();
    }
    if (random === 2) {
      await handleBitcoinPricePost();
    }
    if (random === 3) {
      if (Math.random() < 0.5) {
        await handleBiggestTransactionPost();
      } else {
        await handleTransactionDetailsPost();
      }
    }
    if (random === 4) {
      await handleLightningNetworkPost();
    }
    if (random === 5) {
      await handleBitcoinFeesPost();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
