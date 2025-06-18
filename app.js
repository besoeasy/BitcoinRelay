import "dotenv/config";

import { hndl_btclight } from "./modules/btc_light.js";
import { hndl_btcfee } from "./modules/btc_fee.js";
import { hndl_btcprice } from "./modules/btc_price.js";
import { hndl_whale } from "./modules/txn_whale.js";
import { hndl_btcchart } from "./modules/btc_chart.js";
import { hndl_reddit } from "./modules/reddix.js";
import { hndl_news } from "./modules/news.js";

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
    const content = await handler_data[0]();

    const content2 = await handler_data[1]();

    console.log(content + "\n\n\n" + content2);

    const postResult = await postToNostr(process.env.NSEC, content, {
      expirationDays: 20,
    });

    console.log("Pushed to Nostr:", postResult.eventId);

    const postResult2 = await postToNostr(process.env.NSEC, content2, {
      expirationDays: 25,
    });

    console.log("Pushed to Nostr:", postResult2.eventId);


    if (Math.random() < 0.2) {
  const sponsorMsg = `Crypto Relay is sponsored by

https://2xpt.com - an anonymous bitcoin game, no emails, no phone, no KYC.
`;

  const sponsorPost = await postToNostr(process.env.NSEC, sponsorMsg, {
    expirationDays: 30,
  });
  console.log("Pushed Sponsor Message to Nostr:", sponsorPost.eventId);
}



    
  } catch (error) {
    console.error("Error in execution:", error);
  } finally {
    process.exit(0);
  }
}

main();
