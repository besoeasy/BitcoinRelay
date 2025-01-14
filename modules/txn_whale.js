const { createCanvas, loadImage } = require("canvas");
const { uploadIMG } = require("../utls/imgup.js");
const { axiosGet } = require("../utls/get.js");

const backimgwhale = [
  "https://bafkreigpvku2yzgcn5hdrtrbaqdr6dfoyhzpl5pnnhskdbx4ar3ntxpaca.ipfs.dweb.link",
];

async function paintWhale(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const backgroundImage = await loadImage(
    backimgwhale[Math.floor(Math.random() * backimgwhale.length)]
  );

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 140;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = "#1b1b1b";
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer("image/png");
}

async function imgWhale(msg) {
  try {
    const buffer = await paintWhale(msg);
    return (await uploadIMG(buffer)) || null;
  } catch (error) {
    console.error("Error generating whale image:", error.message);
    return null;
  }
}

async function analyzeTransactions() {
  try {
    const latestBlockHash = await axiosGet(
      "https://blockstream.info/api/blocks/tip/hash"
    );

    if (!latestBlockHash) {
      throw new Error("Failed to fetch the latest block hash.");
    }

    const transactions = await axiosGet(
      `https://blockstream.info/api/block/${latestBlockHash}/txs`
    );

    if (!transactions || transactions.length === 0) {
      return "It's quiet out there… no transactions in the latest block. Did Bitcoin fall asleep?";
    }

    const biggestTransaction = transactions
      .filter((tx) => tx.vout.length < 3) // Focusing on "big whales" with few outputs
      .reduce(
        (max, tx) => {
          const totalOutput = tx.vout.reduce(
            (sum, output) => sum + output.value,
            0
          );
          return totalOutput > max.totalOutput
            ? { transaction: tx, totalOutput }
            : max;
        },
        { transaction: null, totalOutput: 0 }
      );

    if (!biggestTransaction.transaction) {
      return "No significant transactions found in the latest block.";
    }

    return await formatWhaleTransaction(
      biggestTransaction.transaction,
      biggestTransaction.totalOutput / 1e8 // Convert Satoshis to BTC
    );
  } catch (error) {
    console.error("Error analyzing transactions:", error.message);
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

async function formatWhaleTransaction(transaction, totalOutput) {
  const { txid, vin, vout } = transaction;

  let output = "🐋 A whale moved Bitcoins!\n\n";
  output += `🔗 Transaction ID: ${txid}\n`;
  output += `💸 Total Bitcoin Transferred: ${totalOutput.toFixed(8)} BTC\n\n`;

  output += "💰 Inputs:\n";
  vin.forEach((input, index) => {
    const value = (input.prevout?.value || 0) / 1e8; // Convert Satoshis to BTC
    const address = input.prevout?.scriptpubkey_address || "Unknown Address";
    output += `  Input ${index + 1}: ${value.toFixed(8)} BTC from ${address}\n`;
  });

  output += "\n📤 Outputs:\n";
  vout.forEach((outputTx, index) => {
    const value = (outputTx.value || 0) / 1e8; // Convert Satoshis to BTC
    const address = outputTx.scriptpubkey_address || "Mystery Address 🔮";
    output += `  Output ${index + 1}: ${value.toFixed(8)} BTC to ${address}\n`;
  });

  try {
    const msgurl = await imgWhale(totalOutput.toFixed(2));
    if (msgurl) {
      output += `\n${msgurl}`;
    }
  } catch (error) {
    console.error("Error generating image URL:", error.message);
  }

  output += `\n🔍 View on Explorer: https://mempool.space/tx/${txid}\n`;

  return output;
}

module.exports = {
  analyzeTransactions,
};
