require("dotenv").config();

const { hndl_btclight } = require("./modules/btc_light.js");
const { hndl_btcfee } = require("./modules/btc_fee.js");
const { hndl_btcprice } = require("./modules/btc_price.js");
const { hndl_whale } = require("./modules/txn_whale.js");
const { hndl_btcchart } = require("./modules/btc_chart.js");
const { hndl_reddit } = require("./modules/reddix.js");
const { hndl_news } = require("./modules/news.js");

const { commitMsg } = require("./utils/nostr.js");
const { aigen } = require("./utils/ai.js");

async function pushIt(text) {
  if (process.env.NSEC) {
    try {
      await commitMsg(text, process.env.NSEC, 10, 4);
    } catch (error) {
      console.error("Error pushing message:", error);
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const handler_data = shuffleArray([hndl_btcchart, hndl_btcprice, hndl_btcfee, hndl_whale, hndl_btclight]);
  const handler_updates = shuffleArray([hndl_reddit, hndl_news]);

  try {
    if (Math.random() > 0.5) {
      const content2 = await handler_data[0]();

      await pushIt(content2);
    } else {
      const content3 = await handler_updates[0]();
      const aicontent = await aigen(content3);

      await pushIt(aicontent);
    }
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
