import { createCanvas, loadImage } from 'canvas';
import { uploadIMG } from '../utils/imgup.js';
import { axiosGet } from '../utils/get.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backimgwhale = [path.resolve(__dirname, '../images/whale/1.png')];

async function paintWhale(textx) {
  const width = 1000;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const backgroundImage = await loadImage(backimgwhale[Math.floor(Math.random() * backimgwhale.length)]);

  context.drawImage(backgroundImage, 0, 0, width, height);

  const fontSize = 140;
  context.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillStyle = '#1b1b1b';
  context.fillText(textx, width / 2, height / 2);

  return canvas.toBuffer('image/png');
}

async function imgWhale(msg) {
  try {
    const buffer = await paintWhale(msg);
    return (await uploadIMG(buffer)) || null;
  } catch (error) {
    console.error('Error generating whale image:', error.message);
    return null;
  }
}

async function hndl_whale() {
  try {
    // Get the latest 10 block hashes
    const blocks = await axiosGet('https://mempool.space/api/blocks');
    if (!blocks || blocks.length === 0) {
      throw new Error('Failed to fetch recent blocks.');
    }
    const blockHashes = blocks.slice(0, 10).map(b => b.id);

    let biggestTransaction = { transaction: null, totalOutput: 0 };

    for (const blockHash of blockHashes) {
      const transactions = await axiosGet(`https://mempool.space/api/block/${blockHash}/txs`);
      if (!transactions || transactions.length === 0) {
        continue;
      }
      transactions
        .filter((tx) => tx.vout.length < 3) // Focusing on "big whales" with few outputs
        .forEach((tx) => {
          const totalOutput = tx.vout.reduce((sum, output) => sum + output.value, 0);
          if (totalOutput > biggestTransaction.totalOutput) {
            biggestTransaction = { transaction: tx, totalOutput };
          }
        });
    }

    if (!biggestTransaction.transaction) {
      return 'No significant transactions found in the last 10 blocks.';
    }

    return await formatWhaleTransaction(
      biggestTransaction.transaction,
      biggestTransaction.totalOutput / 1e8 // Convert Satoshis to BTC
    );
  } catch (error) {
    console.error('Error analyzing transactions:', error.message);
    return `🚨 Error fetching Bitcoin data: ${error.message}`;
  }
}

async function formatWhaleTransaction(transaction, totalOutput) {
  const { txid, vin, vout } = transaction;

  let output = '🐋 A whale moved Bitcoins!\n\n';
  output += `🔗 Transaction ID: ${txid}\n`;
  output += `💸 Total Bitcoin Transferred: ${parseInt(totalOutput)} BTC\n\n`;

  output += '💰 Inputs:\n';
  vin.forEach((input, index) => {
    const value = (input.prevout?.value || 0) / 1e8; // Convert Satoshis to BTC
    const address = input.prevout?.scriptpubkey_address || 'Unknown Address';
    output += `  Input ${index + 1}: ${value.toFixed(8)} BTC from ${address}\n`;
  });

  output += '\n📤 Outputs:\n';
  vout.forEach((outputTx, index) => {
    const value = (outputTx.value || 0) / 1e8; // Convert Satoshis to BTC
    const address = outputTx.scriptpubkey_address || 'Mystery Address 🔮';
    output += `  Output ${index + 1}: ${value.toFixed(8)} BTC to ${address}\n`;
  });

  try {
    const msgurl = await imgWhale(totalOutput.toFixed(2));
    if (msgurl) {
      output += `\n${msgurl}`;
    }
  } catch (error) {
    console.error('Error generating image URL:', error.message);
  }

  output += `\n🔍 View on Explorer: https://mempool.space/tx/${txid}\n`;

  output += '\n#bitcoin #whalealert #whale 🐳';

  return output;
}

export {
  hndl_whale,
};