require("dotenv").config();

const { text2img, commitMsg, getBitcoinPrice } = require("./uts.js");

async function main() {
  const btcprice = await getBitcoinPrice();

  const msgurl = await text2img(`Bitcoin : ${btcprice} USD`);

  if (msgurl) {
    await commitMsg(
      process.env.NSEC,
      `Bitcoin : ${btcprice} USD
       #bitcoin #updates 
       ${msgurl}
       
       `
    );
  }

  process.exit(0);
}

main();
