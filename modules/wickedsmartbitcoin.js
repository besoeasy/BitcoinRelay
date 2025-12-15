async function wickedsmartbitcoin() {
  if (Math.random() < 0.4) {
    const date = new Date();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");
    const getdate = `${month}-${day}`;

    const msg =
      `Bitcoin Price On ${getdate}\n\n` + `https://wickedsmartbitcoin.com/final_frames/price_on_this_day.png?v=${date.getTime()}\n\n` + `#bitcoin #priceonthisday #pricehistory`;

    return msg;
  }

  if (Math.random() < 0.5) {
    const msg = `Bitcoin Node Count Over Time\n\n` + `https://wickedsmartbitcoin.com/final_frames/node_count.png?v=${date.getTime()}\n\n` + `#bitcoin #nodecount #decentralization`;

    return msg;
  }

  if (Math.random() < 0.5) {
    const msg = `Bitcoin Halving Progress\n\n` + `https://wickedsmartbitcoin.com/final_frames/halving_progress.png?v=${date.getTime()}\n\n` + `#bitcoin #halving #btc`;

    return msg;
  }
}

export { wickedsmartbitcoin };
