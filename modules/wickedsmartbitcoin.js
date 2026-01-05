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

  const frames = [
    {
      title: "Bitcoin Price This Day",
      url: `https://wickedsmartbitcoin.com/final_frames/price_on_this_day.png?v=${date.getTime()}`,
      hashtags: "#bitcoin #priceonthisday #pricehistory",
    },
    {
      title: "Bitcoin Node Count Over Time",
      url: `https://wickedsmartbitcoin.com/final_frames/node_count.png?v=${date.getTime()}`,
      hashtags: "#bitcoin #nodecount #decentralization",
    },
    {
      title: "Bitcoin Halving Progress",
      url: `https://wickedsmartbitcoin.com/final_frames/halving_progress.png?v=${date.getTime()}`,
      hashtags: "#bitcoin #halving #btc",
    },
  ];

  const choice = frames[Math.floor(Math.random() * frames.length)];
  const imageBuffer = await downloadImage(choice.url);
  const uploadedUrl = await uploadIMG(imageBuffer);

  return `${choice.title}\n\n${uploadedUrl}\n\n${choice.hashtags}`;
}

export { wickedsmartbitcoin };
