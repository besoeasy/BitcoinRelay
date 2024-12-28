require("dotenv").config();

const { uploadToImgbb } = require("./modules/pag.js");

const { paintImg } = require("./create/canva.js");

const { commitMsg } = require("./modules/nostr.js");

const { getBitcoinPrice } = require("./modules/pag.js");

async function text2img(msg) {
  const buffer = await paintImg(msg);

  const msgurl = await uploadToImgbb(process.env.IMGBB_API_KEY, buffer);

  return msgurl || null;
}

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
