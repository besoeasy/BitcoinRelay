const { createCanvas } = require("canvas");

async function paintImg(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Set background to black
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  // Font color: White for "Bitcoin" and "USD"
  const fontColor = "#ffffff";

  // Set font size and style
  const fontSize = 120;  // Increased font size for larger text
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw "Bitcoin" at the top
  context.fillStyle = fontColor;
  context.fillText("BITCOIN", width / 2, height / 4 - fontSize / 2);

  // Randomly choose red or green for textx
  const textxColor = Math.random() > 0.5 ? "#e74c3c" : "#2ecc71";  // Red or Green

  // Draw dynamic text (textx) in the middle
  context.font = `bold ${fontSize * 1.5}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = textxColor;
  context.fillText(textx, width / 2, height / 2);

  // Draw "USD" at the bottom
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = fontColor;
  context.fillText("USD", width / 2, height * 3 / 4 + fontSize / 2);

  // Convert canvas to buffer
  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

module.exports = {
  paintImg,
};
