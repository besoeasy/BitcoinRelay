import "dotenv/config";

import { hndl_btclight } from "./modules/btc_light.js";
import { hndl_btcfee } from "./modules/btc_fee.js";
import { hndl_btcprice } from "./modules/btc_price.js";
import { hndl_whale } from "./modules/txn_whale.js";
import { hndl_btcchart } from "./modules/btc_chart.js";
import { hndl_news } from "./modules/news.js";
import { hndl_btcHyperliquid } from "./modules/btc_hyperliquid.js";
import { wickedsmartbitcoin } from "./modules/wickedsmartbitcoin.js";

import { posttoNostr, sendmessage, getmessage } from "nostr-sdk";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const handlers = shuffleArray([hndl_btcchart, hndl_btcprice, hndl_btcfee, hndl_whale, hndl_btclight, hndl_news, hndl_btcHyperliquid, wickedsmartbitcoin]);

  try {
    const selectedHandlers = handlers.slice(0, 5);
    const contents = await Promise.all(
      selectedHandlers.map(async (handler) => ({
        name: handler.name || "handler",
        content: await handler(),
      }))
    );

    const postConfig = {
      nsec: process.env.NSEC,
      powDifficulty: 5,
    };

    const results = await Promise.all(contents.map(({ content, name }) => posttoNostr(content, postConfig).then((res) => ({ name, res }))));

    console.log("Posted to Nostr:", results);
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
