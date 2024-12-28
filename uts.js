const { uploadToImgbb } = require("./modules/pag.js");

const { paintImg } = require("./create/canva.js");

async function text2img(msg) {
  const buffer = await paintImg(msg);

  const msgurl = await uploadToImgbb(process.env.IMGBB_API_KEY, buffer);

  return msgurl || null;
}

const { commitMsg } = require("./modules/nostr.js");

const { getBitcoinPrice } = require("./modules/pag.js");

module.exports = {
  text2img,

  commitMsg,

  getBitcoinPrice,
};
