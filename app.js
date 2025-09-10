import "dotenv/config";

import { hndl_btclight } from "./modules/btc_light.js";
import { hndl_btcfee } from "./modules/btc_fee.js";
import { hndl_btcprice } from "./modules/btc_price.js";
import { hndl_whale } from "./modules/txn_whale.js";
import { hndl_btcchart } from "./modules/btc_chart.js";
import { hndl_reddit } from "./modules/reddix.js";
import { hndl_news } from "./modules/news.js";
import { hndl_btcHyperliquid } from "./modules/btc_hyperliquid.js";

import { posttoNostr, sendmessage, getmessage } from "nostr-sdk";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const handler_data = shuffleArray([hndl_btcchart, hndl_btcprice, hndl_btcfee, hndl_whale, hndl_btclight, hndl_reddit, hndl_news, hndl_btcHyperliquid]);

  try {
    const content = await handler_data[0]();

    const postResult = await posttoNostr(content, {
      nsec: process.env.NSEC,
      tags: [["client", "nostr-sdk"]],
      powDifficulty: 2,
    });

    console.log(postResult);
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
