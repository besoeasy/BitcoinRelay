const { finalizeEvent, getPublicKey, getEventHash, verifyEvent } = require("nostr-tools/pure");
const { Pool, useWebSocketImplementation } = require("nostr-tools/pool");
const WebSocket = require("ws");
const nip19 = require("nostr-tools/nip19");

// Inject the NodeJS WebSocket implementation
useWebSocketImplementation(WebSocket);

// List of relay URLs
const relayUrls = [
  "wss://nostr.oxtr.dev",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://purplerelay.com",
  "wss://n.ok0.org",
  "wss://zap.watch"
];

// Create a persistent connection pool
const pool = new Pool(relayUrls);

function extractHashtagsAndLinks(content) {
  const hashtagPattern = /#(\w+)/g;
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const hashtags = [];
  const links = [];
  let match;

  while ((match = hashtagPattern.exec(content)) !== null) {
    hashtags.push(match[1]);
  }

  while ((match = urlPattern.exec(content)) !== null) {
    links.push(match[0]);
  }

  return { hashtags, links };
}

function calculatePow(event, difficulty) {
  let nonce = 0;
  let hash;
  do {
    // Remove any previous nonce tag and append a new one
    event.tags = event.tags.filter((tag) => tag[0] !== "nonce");
    event.tags.push(["nonce", String(nonce), String(difficulty)]);
    hash = getEventHash(event);
    nonce++;
  } while (!hash.startsWith("0".repeat(difficulty)));
  return event;
}

async function commitMsg(content, nsec, expireAfter = 150, powDifficulty = 2) {
  try {
    // Decode the secret key
    const { data: sk } = nip19.decode(nsec);
    const pk = getPublicKey(sk);

    // Extract hashtags and links from content
    const { hashtags, links } = extractHashtagsAndLinks(content);
    const timenow = Math.floor(Date.now() / 1000);

    // Build the event template
    const event = {
      kind: 1,
      created_at: timenow,
      tags: [
        ["expiration", String(timenow + 86400 * expireAfter)]
      ],
      content: content,
      pubkey: pk,
    };

    // Append hashtag and link tags
    event.tags.push(...hashtags.map((tag) => ["t", tag]));
    event.tags.push(...links.map((link) => ["r", link]));

    // Apply proof-of-work and sign the event
    const eventWithPow = calculatePow(event, powDifficulty);
    const signedEvent = finalizeEvent(eventWithPow, sk);

    if (!verifyEvent(signedEvent)) {
      console.error("Invalid event signature");
      return;
    }

    // Publish via the persistent pool
    const publishResult = await pool.publish(signedEvent);
    console.log("Published to relays:", publishResult);
  } catch (error) {
    console.error("Error in bot execution:", error);
  }
}

module.exports = { commitMsg };
