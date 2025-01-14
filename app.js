require("dotenv").config();

const { btcLightning } = require("./modules/btc_light.js");

const { getBitcoinFees, paintFees } = require("./modules/btc_fee.js");

const { getBitcoinPrice, paintPrice } = require("./modules/btc_price.js");

const { analyzeTransactions } = require("./modules/txn_whale.js");

const { plotData } = require("./modules/btc_chart.js");

const { fetchAllFeeds } = require("./modules/news.js");

const { uploadIMG } = require("./utls/imgup.js");

const { commitMsg } = require("./utls/nostr.js");

async function pushIt(text) {
  await commitMsg(text, process.env.NSEC);
}

async function handleBitcoinPriceChart() {
  const { buffer, minPrice, maxPrice, avgPrice } = await plotData();

  const msgurl = await uploadIMG(buffer);

  if (msgurl) {
    await pushIt(
      `Bitcoin Price Action :\n\n` +
        `Avg: ${avgPrice} USD\n` +
        `Min: ${minPrice} USD\n` +
        `Max: ${maxPrice} USD\n` +
        `\n#bitcoin #crypto #trade\n` +
        `${msgurl}`
    );
  }
}

async function handleNewsPost() {
  const { title, contentSnippet, link } = await fetchAllFeeds();

  await pushIt(
    `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n\n View : ${link}`
  );
}

async function handleBitcoinPricePost() {
  const { price, sat } = await getBitcoinPrice();

  const buffer = await paintPrice(btcprice);
  const msgurl = await uploadIMG(buffer);

  if (msgurl) {
    await pushIt(
      `Bitcoin: ${price} USD\n1 Satoshi = ${sat} USD\n\n#bitcoin #crypto #bitcoinprice\n${msgurl}`
    );
  }
}

async function handleBiggestTransactionPost() {
  const biggestTx = await analyzeTransactions();

  if (biggestTx) {
    await pushIt(`${biggestTx} \n\n#bitcoin #crypto #wallet #whale`);
  }
}

async function handleLightningNetworkPost() {
  const { node_count, channel_count, avg_capacity, total_capacity } =
    await btcLightning();

  await pushIt(
    `Bitcoin Lightning Network:\n\n` +
      `${node_count} Nodes\n` +
      `${channel_count} Channels\n` +
      `Avg capacity ${(avg_capacity / 100000000).toFixed(4)} BTC\n` +
      `Total capacity ${(total_capacity / 100000000).toFixed(4)} BTC\n\n` +
      `#bitcoin #lightning`
  );
}

async function handleBitcoinFeesPost() {
  const { fee } = await getBitcoinFees();

  const buffer = await paintFees(`${fee} Sat`);
  const msgurl = (await uploadIMG(buffer)) || null;

  if (msgurl) {
    await pushIt(`Bitcoin Fee: ${fee} sat/vB \n\n#bitcoin #fees\n${msgurl}`);
  }
}

async function main() {
  const tasks = [
    handleBitcoinPriceChart,
    handleBitcoinPricePost,
    handleBiggestTransactionPost,
    handleLightningNetworkPost,
    handleBitcoinFeesPost,
    handleNewsPost,
  ];

  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

  try {
    await randomTask();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
