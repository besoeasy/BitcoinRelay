const axios = require("axios");

async function fetchBitcoinPrice() {
  try {
    const response = await axios.get("https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCUSDT");
    return parseInt(response.data.price); // Format price to 2 decimals
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error.message);
    return "Unavailable";
  }
}

async function fetchTopLongShortPositionRatio() {
  try {
    const response = await axios.get("https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=BTCUSDT&period=1h&limit=5");
    return response.data;
  } catch (error) {
    console.error("Error fetching Long/Short Position Ratio:", error.message);
    return [];
  }
}

async function fetchOpenInterest() {
  try {
    const response = await axios.get("https://fapi.binance.com/fapi/v1/openInterest", {
      params: { symbol: "BTCUSDT" },
    });
    return response.data.openInterest || "Unavailable";
  } catch (error) {
    console.error("Error fetching Open Interest:", error.message);
    return "Unavailable";
  }
}

function generateFunnyMessage(longShortRatio) {
  if (longShortRatio > 2.5) {
    return "Longs are flexing like it's leg day at the gym! 🍗 Watch out for the rug pull, though!";
  } else if (longShortRatio < 0.5) {
    return "Shorts are so confident they might as well rename this the 'Bitcoin Bear Market Show.' 🐻";
  } else if (longShortRatio === 1) {
    return "It’s a tightrope walk! Bulls and bears are having a staring contest. 👀 Who will blink first?";
  } else if (longShortRatio > 1.5 && longShortRatio <= 2.5) {
    return "The longs are warming up, but the bears are still growling in the distance. 🐂🐻";
  } else if (longShortRatio < 1 && longShortRatio >= 0.5) {
    return "Bears are getting comfy, but the bulls might have a surprise in store. 🐻🐂";
  } else {
    return "Nothing too wild—this ratio is balanced like a Zen monk. 🧘‍♂️";
  }
}

async function hndl_binance() {
  const bitcoinPrice = await fetchBitcoinPrice();
  const positionData = await fetchTopLongShortPositionRatio();
  const openInterest = await fetchOpenInterest();

  if (positionData.length === 0) {
    return "Error fetching data. Please try again later!";
  }

  const longAccount = positionData[0]?.longAccount || "Unknown";
  const shortAccount = positionData[0]?.shortAccount || "Unknown";
  const longShortRatio = parseFloat(positionData[0]?.longShortRatio || 0);
  const funnyMessage = generateFunnyMessage(longShortRatio);

  return `
Here's the latest Bitcoin update:

- Price: ${bitcoinPrice} USDT
- Long Accounts: ${longAccount}
- Short Accounts: ${shortAccount}
- Long/Short Ratio: ${longShortRatio}
- Open Interest: ${openInterest}

 ${funnyMessage}

#bitcoin #binance #futures #cryptocurrency 
  `.trim();
}

module.exports = { hndl_binance };
