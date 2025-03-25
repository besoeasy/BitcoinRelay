import { axiosGet } from '../utils/get.js';
import { createCanvas, loadImage } from 'canvas';
import { uploadIMG } from '../utils/imgup.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getBitcoinPrice() {
  const data = await axiosGet('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');

  const btcprice = parseInt(data?.bitcoin?.usd || 0);

  return {
    price: btcprice,
    sat: parseFloat(btcprice / 100000000).toFixed(8),
  };
}

const backimgprice = [
  path.resolve(__dirname, '../images/price/1.png'),
  path.resolve(__dirname, '../images/price/2.png'),
  path.resolve(__dirname, '../images/price/3.png'),
  path.resolve(__dirname, '../images/price/4.png')
];

async function paintPrice(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const backgroundImage = await loadImage(backimgprice[Math.floor(Math.random() * backimgprice.length)]);

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 160;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const textxColor = Math.random() > 0.5 ? '#e74c3c' : '#2ecc71';

  context.fillStyle = textxColor;
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer('image/png');
}

async function hndl_btcprice() {
  const { price, sat } = await getBitcoinPrice();

  const buffer = await paintPrice(price);
  const msgurl = await uploadIMG(buffer);

  let msg;

  if (msgurl) {
    msg = `Bitcoin: ${price} USD\n1 Satoshi = ${sat} USD\n${msgurl}\n#bitcoin #crypto #price`;
  }

  return msg;
}

export {
  hndl_btcprice,
  getBitcoinPrice,
};