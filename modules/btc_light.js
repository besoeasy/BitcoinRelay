const { axiosGet } = require("../utils/get.js");

async function btcLightning() {
  const data = await axiosGet(
    "https://mempool.space/api/v1/lightning/statistics/latest"
  );

  return data?.latest || {};
}

async function handleLightningNetworkPost() {
  const { node_count, channel_count, avg_capacity, total_capacity } =
    await btcLightning();

  const msg =
    `Bitcoin Lightning Network:\n\n` +
    `${node_count} Nodes\n` +
    `${channel_count} Channels\n` +
    `Avg capacity ${(avg_capacity / 100000000).toFixed(4)} BTC\n` +
    `Total capacity ${(total_capacity / 100000000).toFixed(4)} BTC\n\n` +
    `#bitcoin #lightning`;

  return msg;
}

module.exports = {
  handleLightningNetworkPost,
};
