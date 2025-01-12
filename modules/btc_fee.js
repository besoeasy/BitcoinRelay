const { axiosGet } = require("../utls/get.js");

async function getBitcoinFees() {
  const fees = await axiosGet("https://mempool.space/api/v1/fees/recommended");

  return {
    fee: fees?.fastestFee || 3,
  };
}

module.exports = {
  getBitcoinFees,
};
