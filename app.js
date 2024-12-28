const nsec = "nsec1xwsfkvdtyfekjhs5jugl2hnrx0rfcm56hmwenmsg083uesxsuddsnxpefa";

const { commitMsg } = require("./x/commit.js");

async function main() {
  const msg = commitMsg(nsec, "Hello, World " + new Date().toISOString());
  console.log(msg);
}

main();
