const { axiosGet } = require("../utls/get.js");
const { createCanvas, loadImage } = require("canvas");

async function getBitcoinPrice() {
  const data = await axiosGet(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );

  const btcprice = parseInt(data?.bitcoin?.usd || 0);

  return {
    price: btcprice,
    sat: parseFloat(btcprice / 100000000).toFixed(8),
  };
}

const backimgprice = [
  "https://bafkreiekpm3hj2cktdjgrxibcpefdjwuc7yahuhqzkbtpltwrpu2nyynnq.ipfs.dweb.link",
  "https://bafkreia62gmdu7mkabkfk5yegeztcdopvgnzvs6wr2ifawlbtflfjyzi5a.ipfs.dweb.link",
  "https://bafkreie3nexatkohw3gltrdkvsgcwhgsmkgp3on6juzlo3irjlfikyd7lu.ipfs.dweb.link",
  "https://bafkreigk7kyjp2ra7w6qeinbhfmgqvehjwwm2qgmkn75y6eobfiti2qcxy.ipfs.dweb.link",
];

async function paintPrice(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const backgroundImage = await loadImage(
    backimgprice[Math.floor(Math.random() * backimgprice.length)]
  );

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 160;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  const textxColor = Math.random() > 0.5 ? "#e74c3c" : "#2ecc71";

  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = textxColor;
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer("image/png");
}

module.exports = {
  getBitcoinPrice,
  paintPrice,
};
