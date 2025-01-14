const { axiosGet } = require("../utils/get.js");
const { createCanvas, loadImage } = require("canvas");
const { uploadIMG } = require("../utils/imgup.js");


async function getBitcoinFees() {
  const fees = await axiosGet("https://mempool.space/api/v1/fees/recommended");

  return {
    fee: fees?.fastestFee || 3,
  };
}

const backimgfees = [
  "https://bafkreigqzxkma2dqkntns36cvtyjx7dadwvbmoytfh3wdb4dv72y34dvpa.ipfs.dweb.link",
];

async function paintFees(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const backgroundImage = await loadImage(
    backimgfees[Math.floor(Math.random() * backimgfees.length)]
  );

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 80;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = "#080808";
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer("image/png");
}

async function hndl_btcfee() {
  const { fee } = await getBitcoinFees();

  const buffer = await paintFees(`${fee} Sat`);
  const msgurl = (await uploadIMG(buffer)) || null;

  let msg;

  if (msgurl) {
    msg = `Bitcoin Fee: ${fee} sat/vB \n\n#bitcoin #fees\n${msgurl}`;
  }

  return msg;
}

module.exports = {
  hndl_btcfee,
};
