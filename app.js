import "dotenv/config";

import { hndl_btclight } from "./modules/btc_light.js";
import { hndl_btcfee } from "./modules/btc_fee.js";
import { hndl_btcprice } from "./modules/btc_price.js";
import { hndl_whale } from "./modules/txn_whale.js";
import { hndl_btcchart } from "./modules/btc_chart.js";
import { hndl_reddit } from "./modules/reddix.js";
import { hndl_news } from "./modules/news.js";

import { aigen } from "./utils/ai.js";

import postToNostr from "nostr-poster";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const handler_data = shuffleArray([
    hndl_btcchart,
    hndl_btcprice,
    hndl_btcfee,
    hndl_whale,
    hndl_btclight,
    hndl_reddit,
    hndl_news,
  ]);

  try {
    const content2 = await handler_data[0]();

    console.log("\n\n\n" + content2 + "\n\n\n");

    const aicontent = await aigen(content2);

    console.log("\n\n\n" + aicontent.response + "\n\n\n");

    console.log("Pushing to Nostr...");

    const postResult = await postToNostr(process.env.NSEC, aicontent.response, {
      expirationDays: 20,
    });

    console.log("Pushed to Nostr:", postResult.eventId);
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
