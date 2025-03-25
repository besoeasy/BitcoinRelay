import { axiosGet } from '../utils/get.js';
import { createCanvas, loadImage } from 'canvas';
import { uploadIMG } from '../utils/imgup.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getBitcoinFees() {
  const fees = await axiosGet('https://mempool.space/api/v1/fees/recommended');

  return {
    fee: fees?.fastestFee || 3,
  };
}

const backimgfees = [
  path.resolve(__dirname, '../images/fees/1.png'),
  path.resolve(__dirname, '../images/fees/2.png')
];

async function paintFees(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const backgroundImage = await loadImage(backimgfees[Math.floor(Math.random() * backimgfees.length)]);

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 80;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillStyle = '#080808';
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer('image/png');
}

async function hndl_btcfee() {
  const { fee } = await getBitcoinFees();

  const buffer = await paintFees(`${fee} Sat/vB`);
  const msgurl = (await uploadIMG(buffer)) || null;

  let msg;

  if (msgurl) {
    msg = `Bitcoin Fee: ${fee} Sat/vB\n#bitcoin #fees\n${msgurl}`;
  }

  return msg;
}

export {
  hndl_btcfee,
};