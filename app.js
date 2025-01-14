require("dotenv").config();

const { handleLightningNetworkPost } = require("./modules/btc_light.js");

const { handleBitcoinFeesPost } = require("./modules/btc_fee.js");

const { handleBitcoinPricePost } = require("./modules/btc_price.js");

const { analyzeTransactions } = require("./modules/txn_whale.js");

const { handleBitcoinPriceChart } = require("./modules/btc_chart.js");

const { handleNewsPost } = require("./modules/news.js");

const { commitMsg } = require("./utls/nostr.js");

async function pushIt(text) {
  await commitMsg(text, process.env.NSEC);
}

async function main() {
  const functions = [
    handleNewsPost,
    handleBitcoinPriceChart,
    handleBitcoinPricePost,
    handleBitcoinFeesPost,
    analyzeTransactions,
    handleLightningNetworkPost,
  ];

  try {
    const randomFunction =
      functions[Math.floor(Math.random() * functions.length)];

    await pushIt(await randomFunction());
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
