const { hndl_reddit } = require("./broken/reddit.js");

async function main() {
  const x = await hndl_reddit();

  console.log(x);
}

main();
