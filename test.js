const { hndl_reddit } = require("./modules/reddix.js");

async function main() {
  const x = await hndl_reddit();

  console.log(x);
}

main();
