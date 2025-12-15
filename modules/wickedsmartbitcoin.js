async function wickedsmartbitcoin() {
  if (Math.random() < 0.4) {
    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[date.getUTCMonth()]; // Months are zero-based
    const day = date.getUTCDate();
    const getdate = `${monthName} ${day}`;

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
