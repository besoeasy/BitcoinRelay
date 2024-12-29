const { createCanvas, loadImage } = require("canvas");

async function paintPrice(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const backgroundImage = await loadImage(
    "https://bafkreiaskulskavaxi5z3x7bgovn563ppnn73q32ahhmgrm656ktalxx54.ipfs.dweb.link/"
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

async function paintTransaction(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const backgroundImage = await loadImage(
    "https://bafkreibqfzj3jmf453cti67qs2o73j547d3ocvwk6elhcrui3ol4revbkm.ipfs.dweb.link/"
  );
  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 150;
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
  paintPrice,
  paintTransaction,
};
