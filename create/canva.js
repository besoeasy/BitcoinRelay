const { createCanvas } = require("canvas");

async function paintImg(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Set background to black
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  // Font color: Randomly choose red or green
  const fontColor = Math.random() > 0.5 ? "#e74c3c" : "#2ecc71";  // Red or Green

  // Set font size and style
  const fontSize = 100;  // Increase font size
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = fontColor;

  // Split text into lines if necessary
  const lineHeight = fontSize * 1.2;
  const lines = splitTextToLines(context, textx, width - 40);

  // Calculate vertical position to center the text
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 + lineHeight / 2;

  // Draw each line of text
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + index * lineHeight);
  });

  // Convert canvas to buffer
  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

// Helper function to split text into lines
function splitTextToLines(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = context.measureText(testLine);
    if (metrics.width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

module.exports = {
  paintImg,
};
