const { createCanvas, loadImage } = require("canvas");

async function paintImg(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Load background image
  const backgroundImage = await loadImage(
    "https://bafkreigtfnady7hyktfh4pnwz7hzb6d5adfjcgwt5drisui4o5bc46m7qu.ipfs.dweb.link/"
  ); // Replace with your image URL
  context.drawImage(backgroundImage, 0, 0, width, height);

  // Set font size and style
  const fontSize = 120; // Increased font size for larger text
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Randomly choose red or green for textx
  const textxColor = Math.random() > 0.5 ? "#e74c3c" : "#2ecc71"; // Red or Green

  // Draw dynamic text (textx) in the middle
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.fillStyle = textxColor;
  context.fillText(textx, width / 2, height / 2);

  // Convert canvas to buffer
  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

module.exports = {
  paintImg,
};
