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

  return {
    fee: fees?.fastestFee || 3,
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

  const transactions = await axiosGet(
    `https://blockstream.info/api/block/${latestBlockHash}/txs`
  );

  if (!transactions || transactions.length === 0) {
    return "It's quiet out there… no transactions in the latest block. Did Bitcoin fall asleep?";
  }

  return { transactions };
}

async function getbigTxn() {
  try {
    const { transactions } = await getblockdata();

    if (!transactions || transactions.length === 0) {
      return "No transactions found in the block.";
    }

    let biggestTransaction = null;
    let secondBiggestTransaction = null;
    let maxTransferred = 0;
    let secondMaxTransferred = 0;

    // Find the biggest transaction
    transactions.forEach((transaction) => {
      const totalOutput = transaction.vout.reduce(
        (sum, output) => sum + output.value,
        0
      );
      if (totalOutput > maxTransferred) {
        secondMaxTransferred = maxTransferred;
        secondBiggestTransaction = biggestTransaction;

        maxTransferred = totalOutput;
        biggestTransaction = transaction;
      } else if (totalOutput > secondMaxTransferred) {
        secondMaxTransferred = totalOutput;
        secondBiggestTransaction = transaction;
      }
    });

    if (!biggestTransaction) {
      return "No valid transactions found in the block. Maybe the whales are broke?";
    }

    // Check if the biggest transaction has more than 4 outputs
    if (biggestTransaction.vout.length > 4 && secondBiggestTransaction) {
      biggestTransaction = secondBiggestTransaction;
      maxTransferred = secondMaxTransferred;
    }

    let output = "🐋 A whale moved his Bitcoins!\n\n";

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

    output += `\nhttps://mempool.space/tx/${biggestTransaction.txid}\n\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

async function getmaxTxn() {
  try {
    const { transactions } = await getblockdata();

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

    const totalPaidOut =
      transactionWithMaxOutputs.vout.reduce(
        (sum, output) => sum + output.value,
        0
      ) / 1e8;

    let output = "";

    if (maxOutputsCount > 4) {
      output += "🔔 Crypto Exchange Paid Bitcoin To Users !\n\n";
    } else {
      output += "🔔 Some Website Paid Bitcoin To Users !\n\n";
    }

    output += `📤 Number of Outputs: ${maxOutputsCount}\n`;
    output += `💸 Total Amount Paid Out: ${totalPaidOut} BTC\n\n`;
    output += `\nhttps://mempool.space/tx/${transactionWithMaxOutputs.txid}\n\n`;

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
  getbigTxn,
  getmaxTxn,
};
