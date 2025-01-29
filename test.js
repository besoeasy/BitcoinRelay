require("dotenv").config();

const { hndl_btclight } = require("./modules/btc_light.js");
const { hndl_btcfee } = require("./modules/btc_fee.js");
const { hndl_btcprice } = require("./modules/btc_price.js");
const { hndl_whale } = require("./modules/txn_whale.js");
const { hndl_btcchart } = require("./modules/btc_chart.js");
const { hndl_reddit } = require("./modules/reddix.js");
const { hndl_binance } = require("./modules/bina.js");
const { hndl_news } = require("./modules/news.js");

const { commitMsg } = require("./utils/nostr.js");
const { aigen } = require("./utils/ai.js");

/**
 * Pushes text to Nostr.
 * @param {string} text - The message to be committed.
 */
async function pushIt(text) {
  try {
    await commitMsg(text, process.env.NSEC, 10, 4);
  } catch (error) {
    console.error("Error pushing message:", error);
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Main function to execute the pipeline.
 */
async function main() {
  const handlers = [hndl_reddit, hndl_news, hndl_btcchart, hndl_btcprice, hndl_btcfee, hndl_whale, hndl_btclight];

  const shuffledHandlers = shuffleArray(handlers);

  try {
    // Pick the second function in shuffled order
    const content = await shuffledHandlers[1]();

    // Generate AI response
    const { success, response } = await aigen(content);

    console.log("Content:", content);
    console.log("Response:", response);

    //  await pushIt(success ? response : content);
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
