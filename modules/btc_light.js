const { axiosGet } = require("../utls/get.js");

async function btcLightning() {
  const data = await axiosGet(
    "https://mempool.space/api/v1/lightning/statistics/latest"
  );

  return data?.latest || {};
}

module.exports = {
  btcLightning,
};
