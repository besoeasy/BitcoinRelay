require("dotenv").config();

const nsec = process.env.NSEC;

const apiKey = process.env.IMGBB_API_KEY;

const { getBitcoinPrice, uploadToImgbb } = require("./modules/pag.js");

const { paintImg } = require("./create/canva.js");

async function main() {
  const btcprice = await getBitcoinPrice();

  const msg = `Bitcoin price is $${btcprice}`;

  const buffer = await paintImg(msg);

  const msgurl = await uploadToImgbb(apiKey, buffer);

  console.log(msg, msgurl);
}

main();
