const { hndl_binance } = require("./modules/bina.js");

async function main() {
  const data = await hndl_binance();
  console.log(data);
}

main();
