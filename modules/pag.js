const axios = require("axios");
const FormData = require("form-data");

async function axiosGet(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error.response?.data || error.message);
    return null;
  }
}

async function getBitcoinPrice() {
  const data = await axiosGet(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  return parseInt(data?.bitcoin?.usd || 0);
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
      error.response?.data || error.message
    );
    return "";
  }
}

async function getBitcoinFees() {
  const fees = await axiosGet("https://mempool.space/api/v1/fees/recommended");
  const mempool = await axiosGet("https://mempool.space/api/mempool");

  return {
    fee: fees?.fastestFee || 0,
    mempoolSize: mempool?.count || 0,
  };
}

async function btcLightning() {
  const data = await axiosGet(
    "https://mempool.space/api/v1/lightning/statistics/latest"
  );

  return data?.latest || {};
}

async function getblockdata() {
  const latestBlockHash = await axiosGet(
    "https://blockstream.info/api/blocks/tip/hash"
  );

  if (!latestBlockHash) {
    throw new Error("Failed to fetch the latest block hash");
  }

  const blockDetails = await axiosGet(
    `https://blockstream.info/api/block/${latestBlockHash}`
  );

  const transactions = await axiosGet(
    `https://blockstream.info/api/block/${latestBlockHash}/txs`
  );

  if (!transactions || transactions.length === 0) {
    return "It's quiet out there… no transactions in the latest block. Did Bitcoin fall asleep?";
  }

  return { transactions, blockDetails };
}

async function getRandomTransactionDetails() {
  try {
    const { transactions, blockDetails } = await getblockdata();
    const randomTransaction =
      transactions[Math.floor(Math.random() * transactions.length)];

    let output = "";

    output += "🎲 A Bitcoin user moved some Bitcoins!\n\n";
    output += `🧱 Block Height: ${blockDetails.height}\n`;
    output += `⏰ Block Time: ${new Date(
      blockDetails.timestamp * 1000
    ).toLocaleString()}\n`;
    output += `🔗 Transaction ID: ${randomTransaction.txid}\n\n`;

    output += "💰 Inputs:\n";
    randomTransaction.vin.forEach((input, index) => {
      const value = input.prevout ? input.prevout.value / 1e8 : 0;
      const address =
        input.prevout?.scriptpubkey_address || "Coinbase (Miners' piggy bank)";
      output += `  Input ${index + 1}: ${value} BTC from ${address}\n`;
    });

    output += "\n📤 Outputs:\n";
    randomTransaction.vout.forEach((outputTx, index) => {
      const value = outputTx.value / 1e8;
      const address = outputTx.scriptpubkey_address || "Mystery address 🔮";
      output += `  Output ${index + 1}: ${value} BTC to ${address}\n`;
    });

    if (!randomTransaction.vin[0].prevout) {
      output +=
        "\n🏗️ This is a Coinbase transaction. Miners just got their paycheck!";
    }

    output += `\n🌐 https://blockchair.com/bitcoin/transaction/${randomTransaction.txid}\n`;

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

    let output = "🐋 A whale moved his Bitcoins!\n\n";
    output += `🧱 Block Height: ${blockDetails.height}\n`;
    output += `⏰ Block Time: ${new Date(
      blockDetails.timestamp * 1000
    ).toLocaleString()}\n`;
    output += `🔗 Transaction ID: ${biggestTransaction.txid}\n`;
    output += `💸 Total Bitcoin Transferred: ${maxTransferred / 1e8} BTC\n\n`;

    output += "💰 Inputs:\n";
    biggestTransaction.vin.forEach((input, index) => {
      const value = input.prevout ? input.prevout.value / 1e8 : 0;
      const address =
        input.prevout?.scriptpubkey_address || "Coinbase (Miners' piggy bank)";
      output += `  Input ${index + 1}: ${value} BTC from ${address}\n`;
    });

    output += "\n📤 Outputs:\n";
    biggestTransaction.vout.forEach((outputTx, index) => {
      const value = outputTx.value / 1e8;
      const address = outputTx.scriptpubkey_address || "Mystery address 🔮";
      output += `  Output ${index + 1}: ${value} BTC to ${address}\n`;
    });

    output += `\n🌐 https://blockchair.com/bitcoin/transaction/${biggestTransaction.txid}\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}


async function getTransactionWithMaxOutputs() {
  try {
    const { transactions, blockDetails } = await getblockdata();

    let transactionWithMaxOutputs = null;
    let maxOutputsCount = 0;

    transactions.forEach((transaction) => {
      const outputsCount = transaction.vout.length;
      if (outputsCount > maxOutputsCount) {
        maxOutputsCount = outputsCount;
        transactionWithMaxOutputs = transaction;
      }
    });

    if (!transactionWithMaxOutputs) {
      return "No valid transactions found in the block. Maybe it's a quiet day.";
    }

    // Calculate the total amount paid out (sum of all outputs)
    const totalPaidOut = transactionWithMaxOutputs.vout.reduce(
      (sum, output) => sum + output.value,
      0
    ) / 1e8; // Convert satoshis to BTC

    let output = "🔔 A Crypto Exchange Paid Bitcoin To Users !\n\n";
    output += `🧱 Block Height: ${blockDetails.height}\n`;
    output += `⏰ Block Time: ${new Date(
      blockDetails.timestamp * 1000
    ).toLocaleString()}\n`;
    output += `🔗 Transaction ID: ${transactionWithMaxOutputs.txid}\n`;
    output += `📤 Number of Outputs: ${maxOutputsCount}\n`;
    output += `💸 Total Amount Paid Out: ${totalPaidOut} BTC\n\n`;
    output += `\n🌐 https://blockchair.com/bitcoin/transaction/${transactionWithMaxOutputs.txid}\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}


module.exports = {
  getBitcoinPrice,
  uploadToImgbb,
  getBitcoinFees,
  btcLightning,
  getRandomTransactionDetails,
  getBiggestTransactionDetails,
  getTransactionWithMaxOutputs,
};
