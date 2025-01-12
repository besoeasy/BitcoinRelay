const { axiosGet } = require("../utls/get.js");

async function getBitcoinPrice() {
  const data = await axiosGet(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );

  const btcprice = parseInt(data?.bitcoin?.usd || 0);

  return {
    price: btcprice,
    sat: parseFloat(btcprice / 100000000).toFixed(8),
  };
}

module.exports = {
  getBitcoinPrice,
};
