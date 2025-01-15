const { hndl_reddit } = require("./modules/reddit.js");

async function main() {
  console.log("Starting...");

  const x = await hndl_reddit();

  console.log(x);

  console.log("Done.");
}

main();
