const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const backimgprice = [
  "https://bafkreiekpm3hj2cktdjgrxibcpefdjwuc7yahuhqzkbtpltwrpu2nyynnq.ipfs.dweb.link",
  "https://bafkreiaskulskavaxi5z3x7bgovn563ppnn73q32ahhmgrm656ktalxx54.ipfs.dweb.link",
  "https://bafkreia62gmdu7mkabkfk5yegeztcdopvgnzvs6wr2ifawlbtflfjyzi5a.ipfs.dweb.link",
  "https://bafkreie3nexatkohw3gltrdkvsgcwhgsmkgp3on6juzlo3irjlfikyd7lu.ipfs.dweb.link",
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

const getBTCData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/ohlc",
      { params: { vs_currency: "usd", days: "1" } }
    );

    const data = response.data;

    const highs = data.map((d) => d[2]);
    const lows = data.map((d) => d[3]);
    const closes = data.map((d) => d[4]);

    const minPrice = parseInt(Math.min(...lows));
    const maxPrice = parseInt(Math.max(...highs));
    const avgPrice = parseInt(
      closes.reduce((sum, price) => sum + price, 0) / closes.length
    );
    return {
      data,
      minPrice,
      maxPrice,
      avgPrice,
    };
  } catch (error) {
    console.error("Error fetching BTC data:", error);
    return { data: [], minPrice: 0, maxPrice: 0, avgPrice: 0 };
  }
};

const plotData = async () => {
  const { data, minPrice, maxPrice, avgPrice } = await getBTCData();
  if (!data.length) return;

  const canvasWidth = 4000;
  const canvasHeight = 2000;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1e1e2e";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Define chart area
  const chartPadding = 150;
  const chartWidth = canvasWidth - chartPadding * 2;
  const chartHeight = canvasHeight - chartPadding * 2;

  const priceRange = maxPrice - minPrice;
  const xScale = chartWidth / data.length;
  const yScale = chartHeight / priceRange;

  // Draw grid
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;

  for (let i = 0; i <= 5; i++) {
    const y = chartPadding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(chartPadding, y);
    ctx.lineTo(canvasWidth - chartPadding, y);
    ctx.stroke();
  }

  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = chartPadding + (chartWidth / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, chartPadding);
    ctx.lineTo(x, canvasHeight - chartPadding);
    ctx.stroke();
  }

  // Draw candlesticks
  data.forEach(([timestamp, open, high, low, close], index) => {
    const x = chartPadding + index * xScale;
    const candleWidth = xScale * 0.6;

    const openY = canvasHeight - chartPadding - (open - minPrice) * yScale;
    const closeY = canvasHeight - chartPadding - (close - minPrice) * yScale;
    const highY = canvasHeight - chartPadding - (high - minPrice) * yScale;
    const lowY = canvasHeight - chartPadding - (low - minPrice) * yScale;

    const isBullish = close > open;
    ctx.fillStyle = isBullish ? "#4caf50" : "#f44336";
    ctx.strokeStyle = ctx.fillStyle;

    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = isBullish ? closeY : openY;
    const bodyBottom = isBullish ? openY : closeY;
    ctx.fillRect(
      x - candleWidth / 2,
      bodyTop,
      candleWidth,
      bodyBottom - bodyTop
    );
  });

  // Annotations: High, Low, and Average Prices
  ctx.fillStyle = "white";
  ctx.font = "80px Arial";

  // High
  ctx.fillText(`High: $${maxPrice}`, chartPadding, chartPadding - 50);

  // Low
  ctx.fillText(
    `Low: $${minPrice}`,
    chartPadding,
    canvasHeight - chartPadding + 100
  );

  // Average Price Line
  const avgY = canvasHeight - chartPadding - (avgPrice - minPrice) * yScale;
  ctx.strokeStyle = "#ffd700"; // Bright yellow for visibility
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(chartPadding, avgY);
  ctx.lineTo(canvasWidth - chartPadding, avgY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#ffd700";
  ctx.fillText(
    `Avg: $${avgPrice}`,
    canvasWidth - chartPadding - 300,
    avgY - 50
  );

  return canvas.toBuffer("image/png");
};

module.exports = { plotData, getBTCData, paintPrice };
