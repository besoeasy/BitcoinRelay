const axios = require("axios");

const { paintWhale } = require("./chaw.js");

const { uploadIMG } = require("./imgup.js");

async function imgWhale(msg) {
  const buffer = await paintWhale(msg);
  return uploadIMG(buffer) || null;
}

async function axiosGet(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error.response?.data || error.message);
    return null;
  }
}

async function analyzeTransactions() {
  try {
    const latestBlockHash = await axiosGet(
      "https://blockstream.info/api/blocks/tip/hash"
    );

    if (!latestBlockHash) {
      throw new Error("Failed to fetch the latest block hash");
    }

    const transactions = await axiosGet(
      `https://blockstream.info/api/block/${latestBlockHash}/txs`
    );

    if (!transactions || transactions.length === 0) {
      return "It's quiet out there… no transactions in the latest block. Did Bitcoin fall asleep?";
    }

    for (const transaction of transactions) {
      const totalOutput =
        transaction.vout.reduce((sum, output) => sum + output.value, 0) / 1e8;

      const outputCount = transaction.vout.length;

      if (totalOutput > 5 && outputCount < 3) {
        return formatWhaleTransaction(transaction, totalOutput);
      }

      if (outputCount > 5) {
        return formatExchangeWithdrawal(transaction, totalOutput, outputCount);
      }
    }

    const randomTransaction =
      transactions[Math.floor(Math.random() * transactions.length)];

    return formatUserTransaction(randomTransaction);
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

async function formatWhaleTransaction(transaction, totalOutput) {
  const { txid, vin, vout } = transaction;

  let output = "🐋 A whale moved Bitcoins!\n\n";
  output += `🔗 Transaction ID: ${txid}\n`;
  output += `💸 Total Bitcoin Transferred: ${totalOutput} BTC\n\n`;

  output += "💰 Inputs:\n";
  vin.forEach((input, index) => {
    const value = input.prevout?.value / 1e8 || 0;
    const address =
      input.prevout?.scriptpubkey_address || "Unknown (Missing Address)";
    output += `  Input ${index + 1}: ${value} BTC from ${address}\n`;
  });

  output += "\n📤 Outputs:\n";
  vout.forEach((outputTx, index) => {
    const value = outputTx.value / 1e8;
    const address = outputTx.scriptpubkey_address || "Mystery address 🔮";
    output += `  Output ${index + 1}: ${value} BTC to ${address}\n`;
  });

  const msgurl = await imgWhale(totalOutput.toFixed(2));

  if (msgurl) {
    output += `\n${msgurl}`;
  }

  output += `\nView : https://mempool.space/tx/${txid}\n`;

  return output;
}

async function formatExchangeWithdrawal(transaction, totalOutput, outputCount) {
  const { txid } = transaction;

  let output = "🔔 Crypto Exchange Withdrawal Detected!\n\n";
  output += `📤 Number of Outputs: ${outputCount}\n`;
  output += `💸 Total Amount Withdrawn: ${totalOutput} BTC\n\n`;
  output += `View : https://mempool.space/tx/${txid}\n`;
  return output;
}

async function formatUserTransaction(transaction) {
  const { txid, vout } = transaction;

  const totalOutput = vout.reduce((sum, output) => sum + output.value, 0) / 1e8;
  let output = "🔔 Random User Transaction Detected!\n\n";
  output += `🔗 Transaction ID: ${txid}\n`;
  output += `💸 Total Bitcoin Transferred: ${totalOutput} BTC\n\n`;
  output += `View : https://mempool.space/tx/${txid}\n`;
  return output;
}

module.exports = {
  analyzeTransactions,
};
