const axios = require("axios");
const FormData = require("form-data");

async function getBitcoinPrice() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    return parseInt(response.data.bitcoin.usd || 0);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function uploadToImgbb(apiKey, buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Provided data is not a Buffer");
  }

  const form = new FormData();
  form.append("image", buffer.toString("base64"));

  try {
    const headers = form.getHeaders();
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?expiration=15550000&key=${apiKey}`,
      form,
      { headers }
    );

    return response.data.data.url || "";
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
  }
}

async function getBitcoinFees() {
  const response = await axios.get(
    "https://mempool.space/api/v1/fees/recommended"
  );
  return response.data.fastestFee;
}

async function getblockdata() {
  const latestBlockResponse = await axios.get(
    "https://blockstream.info/api/blocks/tip/hash"
  );

  const latestBlockHash = latestBlockResponse.data;

  const blockDetailsResponse = await axios.get(
    `https://blockstream.info/api/block/${latestBlockHash}`
  );
  const blockDetails = blockDetailsResponse.data;

  const transactionsResponse = await axios.get(
    `https://blockstream.info/api/block/${latestBlockHash}/txs`
  );
  const transactions = transactionsResponse.data;

  if (transactions.length === 0) {
    return "Its quiet out there… no transactions in the latest block. Did Bitcoin fall asleep?";
  }

  return { transactions, blockDetails };
}

async function getRandomTransactionDetails() {
  try {
    const { transactions, blockDetails } = await getblockdata();

    const randomTransaction =
      transactions[Math.floor(Math.random() * transactions.length)];

    let output = "";

    output += "🎲 A Bitcoin user moved some Bitcoins! Here's the scoop:\n\n";

    output += `🧱 Block Height: ${blockDetails.height}\n`;
    output += `⏰ Block Time: ${new Date(
      blockDetails.timestamp * 1000
    ).toLocaleString()}\n`;
    output += `🔗 Transaction ID: ${randomTransaction.txid}\n\n`;

    output += "💰 Inputs:\n";
    randomTransaction.vin.forEach((input, index) => {
      const value = input.prevout ? input.prevout.value / 1e8 : 0;
      const address = input.prevout
        ? input.prevout.scriptpubkey_address
        : "Coinbase (Miners' piggy bank)";
      output += `  Input ${index + 1}: ${value} BTC from ${address}\n`;
    });

    output += "\n📤 Outputs:\n";
    randomTransaction.vout.forEach((outputTx, index) => {
      const value = outputTx.value / 1e8;
      const address = outputTx.scriptpubkey_address || "Mystery address 🔮";
      output += `  Output ${index + 1}: ${value} BTC to ${address}\n`;
    });

    if (randomTransaction.vin[0].prevout === null) {
      output +=
        "\n🏗️ This is a Coinbase transaction. Miners just got their paycheck!";
    }

    output += `\n🌐 See all the juicy details here: https://blockchair.com/bitcoin/transaction/${randomTransaction.txid}\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

async function getBiggestTransactionDetails() {
  try {
    const { transactions, blockDetails } = await getblockdata();

    let biggestTransaction = null;
    let maxTransferred = 0;

    transactions.forEach((transaction) => {
      const totalOutput = transaction.vout.reduce(
        (sum, output) => sum + output.value,
        0
      );
      if (totalOutput > maxTransferred) {
        maxTransferred = totalOutput;
        biggestTransaction = transaction;
      }
    });

    if (!biggestTransaction) {
      return "No valid transactions found in the block. Maybe the whales are broke?";
    }

    // Build the details

    let output = "";

    output += `🐋 A whale moved his Bitcoins! Here's the splash:\n\n`;

    output += `🧱 Block Height: ${transactions[0].status.block_height}\n`;

    output += `⏰ Block Time: ${new Date(
      blockDetails.timestamp * 1000
    ).toLocaleString()}\n`;

    output += `🔗 Transaction ID: ${biggestTransaction.txid}\n`;
    output += `💸 Total Bitcoin Transferred: ${maxTransferred / 1e8} BTC\n\n`;

    output += "💰 Inputs:\n";
    biggestTransaction.vin.forEach((input, index) => {
      const value = input.prevout ? input.prevout.value / 1e8 : 0;
      const address = input.prevout
        ? input.prevout.scriptpubkey_address
        : "Coinbase (Miners' piggy bank)";
      output += `  Input ${index + 1}: ${value} BTC from ${address}\n`;
    });

    output += "\n📤 Outputs:\n";
    biggestTransaction.vout.forEach((outputTx, index) => {
      const value = outputTx.value / 1e8;
      const address = outputTx.scriptpubkey_address || "Mystery address 🔮";
      output += `  Output ${index + 1}: ${value} BTC to ${address}\n`;
    });

    output += `\n🌐 See the whales splash here: https://blockchair.com/bitcoin/transaction/${biggestTransaction.txid}\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

module.exports = {
  getBitcoinPrice,
  uploadToImgbb,
  getBitcoinFees,
  getRandomTransactionDetails,
  getBiggestTransactionDetails,
};
