const { createCanvas } = require("canvas");

async function paintImg(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#1abc9c";
  context.fillRect(0, 0, width, height);

  context.beginPath();
  context.arc(400, 300, 100, 0, Math.PI * 2, false);
  context.fillStyle = "#3498db";
  context.fill();

  context.font = "48px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#ecf0f1";
  context.fillText(textx, 400, 400);

  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

module.exports = {
  paintImg,
};
