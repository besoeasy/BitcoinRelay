const { hndl_reddit } = require("./modules/reddit.js");

async function main() {
  const x = await hndl_reddit();

  console.log(x);
}

main();
