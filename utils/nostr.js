const { finalizeEvent, getPublicKey, nip19 } = require("nostr-tools");
const WebSocket = require("ws");

/**
 * Posts content to the Nostr network
 * @param {string} nsec - The private key in nsec format
 * @param {string} content - The content to post
 * @returns {Promise<string>} - The event ID (post ID)
 */
function postToNostr(nsec, content) {
  return new Promise((resolve, reject) => {
    try {
      // Decode the nsec to get the hex private key
      let privateKey;
      if (nsec.startsWith("nsec")) {
        privateKey = nip19.decode(nsec).data;
      } else {
        // Assume it's already a hex private key
        privateKey = nsec;
      }

      // Get the public key from the private key
      const pubkey = getPublicKey(privateKey);

      // Create the event
      const event = {
        kind: 1, // Regular text note
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: content,
        pubkey: pubkey,
      };

      // Sign the event
      const signedEvent = finalizeEvent(event, privateKey);
      const eventId = signedEvent.id;

      // Connect to some Nostr relays
      const relays = ["wss://nostr.oxtr.dev", "wss://relay.damus.io", "wss://nos.lol", "wss://purplerelay.com", "wss://n.ok0.org", "wss://zap.watch"];

      let connectedRelays = 0;
      let publishedToAtLeastOne = false;

      for (const relayUrl of relays) {
        const ws = new WebSocket(relayUrl);

        ws.on("open", () => {
          connectedRelays++;
          console.log(`Connected to ${relayUrl}`);

          // Publish the event
          const publishMessage = ["EVENT", signedEvent];
          ws.send(JSON.stringify(publishMessage));
        });

        ws.on("message", (data) => {
          const message = JSON.parse(data.toString());
          if (message[0] === "OK" && message[1] === eventId && message[2]) {
            console.log(`Event published to ${relayUrl}: ${eventId}`);
            publishedToAtLeastOne = true;
            ws.close();

            // If we've published to at least one relay and all connections have been attempted
            if (publishedToAtLeastOne && connectedRelays === relays.length) {
              resolve(eventId);
            }
          }
        });

        ws.on("error", (error) => {
          console.error(`Error with ${relayUrl}:`, error.message);
          connectedRelays++;

          // If all connections have been attempted
          if (connectedRelays === relays.length && publishedToAtLeastOne) {
            resolve(eventId);
          } else if (connectedRelays === relays.length) {
            reject(new Error("Failed to publish to any relay"));
          }
        });
      }

      // Set a timeout in case relays don't respond
      setTimeout(() => {
        if (publishedToAtLeastOne) {
          resolve(eventId);
        } else {
          reject(new Error("Timeout waiting for relay responses"));
        }
      }, 10000);
    } catch (error) {
      reject(error);
    }
  });
}

// Export as CommonJS module
module.exports = postToNostr;
