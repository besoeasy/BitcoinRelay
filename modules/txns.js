const axios = require("axios");

async function axiosGet(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error.response?.data || error.message);
    return null;
  }
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

    const biggestTransaction = transactions
      .filter((transaction) => !transaction.vin.some((input) => !input.prevout))
      .reduce((largest, transaction) => {
        const totalOutput = transaction.vout.reduce(
          (sum, output) => sum + output.value,
          0
        );
        return totalOutput > (largest.totalOutput || 0)
          ? { ...transaction, totalOutput }
          : largest;
      }, null);

    if (!biggestTransaction) {
      return "No valid non-coinbase transactions found in the block.";
    }

    const { txid, vin, vout, totalOutput } = biggestTransaction;

    let output = "🐋 A whale moved Bitcoins!\n\n";
    output += `🔗 Transaction ID: ${txid}\n`;
    output += `💸 Total Bitcoin Transferred: ${totalOutput / 1e8} BTC\n\n`;

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

    output += `\nView on Mempool: https://mempool.space/tx/${txid}\n`;

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

    output += `\nView : https://mempool.space/tx/${biggestTransaction.txid}\n\n`;

    return output;
  } catch (error) {
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

module.exports = {
  getbigTxn,
  getmaxTxn,
};
