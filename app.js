require("dotenv").config();

const {
  uploadToImgbb,
  getBitcoinPrice,
  getBitcoinFees,
  btcLightning,
  getbigTxn,
  getmaxTxn,
  getLinkMetadata,
} = require("./modules/pag.js");

const { plotData, getBTCData, paintPrice } = require("./modules/chaw.js");
const { fetchAllFeeds } = require("./modules/news.js");
const { commitMsg } = require("./modules/nostr.js");

async function pushIt(text) {
  await commitMsg(process.env.NSEC, text);
}

async function imgPrice(msg) {
  const buffer = await paintPrice(msg);
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
    await pushIt(
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
  const { title, contentSnippet, url } = await fetchAllFeeds();

  const { image } = await getLinkMetadata(url);

  let output = `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n\n${url}`;

  if (image) {
    output += `\n\n${image}`;
  }

  await pushIt(output);
}

async function handleBitcoinPricePost() {
  const btcprice = await getBitcoinPrice();
  const sattousd = parseFloat(btcprice / 100000000).toFixed(6);
  const msgurl = await imgPrice(`${btcprice}`);

  if (msgurl) {
    await pushIt(
      `Bitcoin: ${btcprice} USD\n\n1 Satoshi = ${sattousd} USD\n\n#bitcoin #crypto\n${msgurl}`
    );
  }
}

async function handleBiggestTransactionPost() {
  const biggestTx = Math.random() > 0.5 ? await getmaxTxn() : await getbigTxn();

  if (biggestTx) {
    await pushIt(`${biggestTx} #bitcoin #crypto #wallet`);
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

  await pushIt(`Current Bitcoin Fee: ${fee} sat/vB \n\n#bitcoin #fees`);
}

async function main() {
  const tasks = [
    handleBitcoinPriceChart,
    handleBitcoinPricePost,
    handleBiggestTransactionPost,
    handleLightningNetworkPost,
    handleBitcoinFeesPost,
  ];

  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

  try {
    if (Math.random() > 0.5) {
      await handleNewsPost();
    }

    await randomTask();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
