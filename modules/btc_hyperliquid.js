import { axiosGet } from '../utils/get.js';

// Hyperliquid API base URL
const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

// Helper function to make POST requests to Hyperliquid API
async function hyperliquidPost(requestBody) {
  try {
    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making Hyperliquid API request:', error);
    return null;
  }
}

// Get Bitcoin data from Hyperliquid
async function getBitcoinHyperliquidData() {
  try {
    // Get asset contexts (includes funding rate, mark price, open interest)
    const assetContexts = await hyperliquidPost({ type: 'metaAndAssetCtxs' });
    
    if (!assetContexts || !assetContexts[1]) {
      throw new Error('Failed to fetch asset contexts');
    }

    // Get mid prices for all coins
    const midPrices = await hyperliquidPost({ type: 'allMids' });
    
    if (!midPrices) {
      throw new Error('Failed to fetch mid prices');
    }

    // Find Bitcoin data
    const btcIndex = assetContexts[0].universe.findIndex(asset => asset.name === 'BTC');
    
    if (btcIndex === -1) {
      throw new Error('Bitcoin not found in Hyperliquid universe');
    }

    const btcAssetContext = assetContexts[1][btcIndex];
    const btcMidPrice = midPrices.BTC;

    return {
      name: 'BTC',
      midPrice: parseFloat(btcMidPrice),
      markPrice: parseFloat(btcAssetContext.markPx),
      oraclePrice: parseFloat(btcAssetContext.oraclePx),
      fundingRate: parseFloat(btcAssetContext.funding),
      openInterest: parseFloat(btcAssetContext.openInterest),
      dayVolume: parseFloat(btcAssetContext.dayNtlVlm),
      prevDayPrice: parseFloat(btcAssetContext.prevDayPx),
      premium: parseFloat(btcAssetContext.premium),
      impactPrices: {
        bid: parseFloat(btcAssetContext.impactPxs[0]),
        ask: parseFloat(btcAssetContext.impactPxs[1])
      }
    };
  } catch (error) {
    console.error('Error fetching Bitcoin Hyperliquid data:', error);
    return null;
  }
}

// Get historical funding rates for Bitcoin
async function getBitcoinFundingHistory() {
  try {
    const endTime = Date.now();
    const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
    
    const fundingHistory = await hyperliquidPost({
      type: 'fundingHistory',
      coin: 'BTC',
      startTime: startTime,
      endTime: endTime
    });

    if (!fundingHistory || fundingHistory.length === 0) {
      return null;
    }

    // Get the latest funding rate
    const latestFunding = fundingHistory[fundingHistory.length - 1];
    
    return {
      latestRate: parseFloat(latestFunding.fundingRate),
      premium: parseFloat(latestFunding.premium),
      time: new Date(latestFunding.time)
    };
  } catch (error) {
    console.error('Error fetching Bitcoin funding history:', error);
    return null;
  }
}

// Get predicted funding rates across venues
async function getCrossPlatformFunding() {
  try {
    const predictedFunding = await hyperliquidPost({
      type: 'predictedFundings'
    });

    if (!predictedFunding) {
      return null;
    }

    // Find BTC data
    const btcData = predictedFunding.find(([coin, data]) => coin === 'BTC');
    
    if (!btcData) {
      return null;
    }

    const [, venues] = btcData;
    const fundingComparison = {};

    venues.forEach(([venue, data]) => {
      fundingComparison[venue] = {
        fundingRate: parseFloat(data.fundingRate),
        nextFundingTime: new Date(data.nextFundingTime)
      };
    });

    return fundingComparison;
  } catch (error) {
    console.error('Error fetching cross-platform funding:', error);
    return null;
  }
}

// Main handler function
async function hndl_btcHyperliquid() {
  try {
    const btcData = await getBitcoinHyperliquidData();
    
    if (!btcData) {
      return '🚨 Failed to fetch Bitcoin data from Hyperliquid';
    }

    // Calculate 24h price change
    const priceChange = btcData.markPrice - btcData.prevDayPrice;
    const priceChangePercent = (priceChange / btcData.prevDayPrice) * 100;
    const changeEmoji = priceChange >= 0 ? '📈' : '📉';

    // Format funding rate
    const fundingPercent = (btcData.fundingRate * 100).toFixed(4);
    const fundingEmoji = btcData.fundingRate >= 0 ? '🔴' : '🟢';
    
    // Calculate annual funding rate (funding happens every 8 hours)
    const annualFunding = (btcData.fundingRate * 3 * 365 * 100).toFixed(2);

    let output = '🌊 Bitcoin on Hyperliquid\n\n';
    output += `💰 Mark Price: $${btcData.markPrice.toLocaleString()}\n`;
    output += `📊 Mid Price: $${btcData.midPrice.toLocaleString()}\n`;
    output += `🔮 Oracle Price: $${btcData.oraclePrice.toLocaleString()}\n\n`;
    
    output += `${changeEmoji} 24h Change: $${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)\n\n`;
    
    output += `${fundingEmoji} Funding Rate: ${fundingPercent}%\n`;
    output += `📅 Annual Funding: ${annualFunding}%\n`;
    output += `⚖️ Premium: ${(btcData.premium * 100).toFixed(4)}%\n\n`;
    
    output += `🏦 Open Interest: ${btcData.openInterest.toLocaleString()} BTC\n`;
    output += `📈 24h Volume: $${btcData.dayVolume.toLocaleString()}\n\n`;
    
    output += `💹 Impact Prices:\n`;
    output += `  📉 Bid: $${btcData.impactPrices.bid.toLocaleString()}\n`;
    output += `  📈 Ask: $${btcData.impactPrices.ask.toLocaleString()}\n\n`;

    // Get cross-platform funding comparison
    const crossPlatformFunding = await getCrossPlatformFunding();
    if (crossPlatformFunding) {
      output += `🌐 Funding Rate Comparison:\n`;
      Object.entries(crossPlatformFunding).forEach(([venue, data]) => {
        const rate = (data.fundingRate * 100).toFixed(4);
        output += `  ${venue}: ${rate}%\n`;
      });
      output += '\n';
    }

    output += '#bitcoin #hyperliquid #perp #funding #defi';

    return output;
  } catch (error) {
    console.error('Error in hndl_btcHyperliquid:', error);
    return `🚨 Error fetching Hyperliquid data: ${error.message}`;
  }
}

export {
  hndl_btcHyperliquid,
  getBitcoinHyperliquidData,
  getBitcoinFundingHistory,
  getCrossPlatformFunding
};
