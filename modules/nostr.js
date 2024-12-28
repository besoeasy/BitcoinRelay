const {
  finalizeEvent,
  getPublicKey,
  getEventHash,
} = require("nostr-tools/pure");
const { Relay } = require("nostr-tools/relay");
const { useWebSocketImplementation } = require("nostr-tools/pool");
const WebSocket = require("ws");
const nip19 = require("nostr-tools/nip19");

useWebSocketImplementation(WebSocket);

const relayarray = [
  "wss://relay.damus.io",
  "wss://purplerelay.com",
  "wss://strfry.iris.to",
  "wss://relay.nostr.space",
  "wss://relay.0xchat.com",
];

function computePow(event, difficulty) {
  let nonce = 0;
  while (true) {
    event.tags = [["nonce", nonce.toString(), difficulty.toString()]];
    const id = getEventHash(event);

    if (parseInt(id.substring(0, Math.ceil(difficulty / 4)), 16) === 0) {
      return { id, nonce };
    }
    nonce++;
  }
}

async function commitMsg(nsec, content) {
  try {
    const { type, data } = nip19.decode(nsec);

    const sk = data;
    const pk = getPublicKey(sk);

    // Create the event template
    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content,
      pubkey: pk, // Add the public key here
    };

    // Compute PoW
    const difficulty = 20; // Set PoW difficulty
    const { id, nonce } = computePow(eventTemplate, difficulty);

    // Update the event template with PoW tags
    eventTemplate.tags = [["nonce", nonce.toString(), difficulty.toString()]];

    // Sign the event
    const signedEvent = finalizeEvent(eventTemplate, sk);

    // Publish the event to all relays
    for (const relayUrl of relayarray) {
      try {
        const relay = await Relay.connect(relayUrl);
        await relay.publish(signedEvent);
        await relay.close();
      } catch (error) {
        console.error(`Error : ${relayUrl}`);
      }
    }

    console.log("              ");
    console.log(signedEvent);
    console.log("              ");
  } catch (error) {
    console.error("Error in bot execution:", error);
  }
}

module.exports = { commitMsg };
