const nsec = "nsec1xwsfkvdtyfekjhs5jugl2hnrx0rfcm56hmwenmsg083uesxsuddsnxpefa";

const { commitMsg } = require("./x/commit.js");

const axios = require("axios");

async function getBitcoinPrice() {
  try {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );

    return response.data.bpi.USD.rate;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function main() {
  const btcprice = await getBitcoinPrice();

  const msg = `Bitcoin price is $${btcprice}`;

  const commit = commitMsg(nsec, msg);

  console.log(commit);
}

main();
