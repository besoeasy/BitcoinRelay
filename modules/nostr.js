const {
  finalizeEvent,
  getPublicKey,
  getEventHash,
  verifyEvent,
} = require("nostr-tools/pure");
const { Relay } = require("nostr-tools/relay");
const { useWebSocketImplementation } = require("nostr-tools/pool");
const WebSocket = require("ws"); // Import WebSocket from the ws package
const nip19 = require("nostr-tools/nip19");

useWebSocketImplementation(WebSocket); // Set ws as the WebSocket implementation

const relayarray = [
  "wss://nostr-1.nbo.angani.co",
  "wss://nostr.bitcoiner.social",
  "wss://nostr.gruntwerk.org",
  "wss://nostr.middling.mydns.jp",
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.roundrockbitcoiners.com",
  "wss://nostr.vulpem.com",
  "wss://relay.damus.io",
  "wss://soloco.nl",
  "wss://bitcoiner.social",
  "wss://puravida.nostr.land",
  "wss://relay.minibolt.info",
  "wss://purplerelay.com",
  "wss://strfry.iris.to",
  "wss://relay.0xchat.com",
];

function extractHashtagsAndLinks(content) {
  const hashtagPattern = /#(\w+)/g;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  let hashtags = [];
  let links = [];
  let match;

  // Extract hashtags
  while ((match = hashtagPattern.exec(content)) !== null) {
    hashtags.push(`${match[1]}`);
  }

  // Extract links
  while ((match = urlPattern.exec(content)) !== null) {
    links.push(match[0]);
  }

  return { hashtags, links };
}

function calculatePow(event, difficulty) {
  let nonce = 0;
  let hash;

  do {
    event.tags = event.tags.filter((tag) => tag[0] !== "nonce");
    event.tags.push(["nonce", String(nonce), String(difficulty)]);
    hash = getEventHash(event);
    nonce++;
  } while (!hash.startsWith("0".repeat(difficulty)));

  return event;
}

async function commitMsg(nsec, content, powDifficulty = 4) {
  try {
    const { type, data } = nip19.decode(nsec);

    const sk = data;
    const pk = getPublicKey(sk);

    // Extract hashtags and links from content
    const { hashtags, links } = extractHashtagsAndLinks(content);

    const timenow = Math.floor(Date.now() / 1000);

    const eventTemplate = {
      kind: 1,
      created_at: timenow,
      tags: [["expiration", String(timenow + 100)]],
      content: content,
      pubkey: pk,
    };

    eventTemplate.tags.push(...hashtags.map((tag) => ["t", tag]));
    eventTemplate.tags.push(...links.map((link) => ["r", link]));

    // Perform PoW
    const eventWithPow = calculatePow(eventTemplate, powDifficulty);

    const signedEvent = finalizeEvent(eventWithPow, sk);

    if (!verifyEvent(signedEvent)) {
      console.error("Invalid event signature");
      return;
    }

    console.log(signedEvent);

    for (const relayUrl of relayarray) {
      try {
        const relay = await Relay.connect(relayUrl);

        await relay.publish(signedEvent);

        await relay.close();
      } catch (error) {
        console.error(`Error : ${relayUrl}`);
      }
    }
  } catch (error) {
    console.error("Error in bot execution:", error);
  }
}

module.exports = { commitMsg };
