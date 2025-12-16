import axios from "axios";
import { uploadIMG } from "../utils/imgup.js";

async function downloadImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
    throw error;
  }
}

async function wickedsmartbitcoin() {
  const date = new Date();

  if (Math.random() < 0.35) {
    const imageUrl = `https://wickedsmartbitcoin.com/final_frames/price_on_this_day.png?v=${date.getTime()}`;
    const imageBuffer = await downloadImage(imageUrl);
    const uploadedUrl = await uploadIMG(imageBuffer);

    const msg = `Bitcoin Price This Day\n\n` + `${uploadedUrl}\n\n` + `#bitcoin #priceonthisday #pricehistory`;

    return msg;
  }

  if (Math.random() < 0.5) {
    const imageUrl = `https://wickedsmartbitcoin.com/final_frames/node_count.png?v=${date.getTime()}`;
    const imageBuffer = await downloadImage(imageUrl);
    const uploadedUrl = await uploadIMG(imageBuffer);

    const msg = `Bitcoin Node Count Over Time\n\n` + `${uploadedUrl}\n\n` + `#bitcoin #nodecount #decentralization`;

    return msg;
  }

  if (Math.random() < 0.5) {
    const imageUrl = `https://wickedsmartbitcoin.com/final_frames/halving_progress.png?v=${date.getTime()}`;
    const imageBuffer = await downloadImage(imageUrl);
    const uploadedUrl = await uploadIMG(imageBuffer);

    const msg = `Bitcoin Halving Progress\n\n` + `${uploadedUrl}\n\n` + `#bitcoin #halving #btc`;

    return msg;
  }
}

export { wickedsmartbitcoin };
