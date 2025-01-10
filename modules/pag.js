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

const getBalance = async (address) => {
  const data = await axiosGet("https://blockchain.info/rawaddr/" + address);

  return {
    balance: data.final_balance,
    balanceInBTC: data.final_balance / 100000000,
    totalReceived: data.total_received,
    totalReceivedInBTC: data.total_received / 100000000,
  };
};

async function getBitcoinPrice() {
  const data = await axiosGet(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  return parseInt(data?.bitcoin?.usd || 0);
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

module.exports = {
  getBitcoinPrice,
  getBitcoinFees,
  btcLightning,
  getBalance,
};
