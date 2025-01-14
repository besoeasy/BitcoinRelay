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
  "wss://nostr.oxtr.dev",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://purplerelay.com",
  "wss://n.ok0.org",
  "wss://zap.watch",
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

async function commitMsg(content, nsec, expireAfter = 180, powDifficulty = 4) {
  try {
    const { type, data } = nip19.decode(nsec);

    const sk = data;
    const pk = getPublicKey(sk);

    const { hashtags, links } = extractHashtagsAndLinks(content);

    const timenow = Math.floor(Date.now() / 1000);

    const eventTemplate = {
      kind: 1,
      created_at: timenow,
      tags: [["expiration", String(timenow + 86400 * expireAfter)]],
      content: content,
      pubkey: pk,
    };

    eventTemplate.tags.push(...hashtags.map((tag) => ["t", tag]));
    eventTemplate.tags.push(...links.map((link) => ["r", link]));

    const eventWithPow = calculatePow(eventTemplate, powDifficulty);

    const signedEvent = finalizeEvent(eventWithPow, sk);

    if (!verifyEvent(signedEvent)) {
      console.error("Invalid event signature");
      return;
    }

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
