require("dotenv").config();

const { hndl_btclight } = require("./modules/btc_light.js");

const { hndl_btcfee } = require("./modules/btc_fee.js");

const { hndl_btcprice } = require("./modules/btc_price.js");

const { hndl_whale } = require("./modules/txn_whale.js");

const { hndl_btcchart } = require("./modules/btc_chart.js");

const { hndl_reddit } = require("./modules/reddit.js");

const { hndl_news } = require("./modules/news.js");

const { commitMsg } = require("./utils/nostr.js");

async function pushIt(text) {
  await commitMsg(text, process.env.NSEC, 10, 4);
}

const devmsg = "Hey! If youd like to support the project, feel free to send some BTC to: bc1q6euy5rpway8le2rv0m4djj6udltypf4yk3ptes \n\nOr, if you’re into coding, you can help improve the bot by contributing here: https://github.com/besoeasy/cryptorelay \n\nThanks for your support! #nostr #bitcoin #news #crypto";

async function main() {
  const funcx = [hndl_news, hndl_btcchart, hndl_btcprice, hndl_btcfee, hndl_whale, hndl_btclight, hndl_reddit];

  try {
    const content = await funcx[Math.floor(Math.random() * funcx.length)]();
    console.log(content);

    await pushIt(content);

    if (Math.random() < 0.95) {
      await pushIt(devmsg);
    }

  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();
