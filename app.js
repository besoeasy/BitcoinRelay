require("dotenv").config();

const { getBitcoinPrice, uploadToImgbb } = require("./modules/pag.js");

const { paintImg } = require("./create/canva.js");

const { commitMsg } = require("./modules/nostr.js");

async function main() {
  const btcprice = await getBitcoinPrice();

  const msg = `Bitcoin Is ${btcprice} USD`;

  const buffer = await paintImg(msg);

  const msgurl = await uploadToImgbb(process.env.IMGBB_API_KEY, buffer);

  console.log(msg, msgurl);

  if (msgurl) {
    await commitMsg(process.env.NSEC, `${msg} ${msgurl}`);
  }
}

main();
