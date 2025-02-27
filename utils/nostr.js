const { finalizeEvent, getPublicKey, nip19, getEventHash } = require('nostr-tools');
const WebSocket = require('ws');

/**
 * Extracts hashtags and links from content
 * @param {string} content - The content to analyze
 * @returns {Object} - Object containing arrays of hashtags and links
 */
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

/**
 * Calculates POW for an event
 * @param {Object} event - The event object
 * @param {number} difficulty - The POW difficulty
 * @returns {Object} - Event with POW calculated
 */
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

/**
 * Posts content to the Nostr network with POW
 * @param {string} nsec - The private key in nsec format
 * @param {string} content - The content to post
 * @returns {Promise<string>} - The event ID (post ID)
 */
function postToNostr(nsec, content) {
  return new Promise((resolve, reject) => {
    try {
      // Decode the nsec to get the hex private key
      let privateKey;
      if (nsec.startsWith('nsec')) {
        privateKey = nip19.decode(nsec).data;
      } else {
        // Assume it's already a hex private key
        privateKey = nsec;
      }

      // Get the public key from the private key
      const pubkey = getPublicKey(privateKey);
      
      // Extract hashtags and links
      const { hashtags, links } = extractHashtagsAndLinks(content);
      
      // Create tags array with hashtags and links
      const tags = [
        ...hashtags.map(tag => ['t', tag]),
        ...links.map(url => ['r', url])
      ];

      // Create the event
      const event = {
        kind: 1, // Regular text note
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: content,
        pubkey: pubkey
      };

      console.log('Calculating POW with difficulty 3...');
      // Calculate POW with difficulty 3
      const eventWithPow = calculatePow(event, 3);
      console.log('POW calculated successfully');

      // Sign the event
      const signedEvent = finalizeEvent(eventWithPow, privateKey);
      const eventId = signedEvent.id;
      
      // Connect to some Nostr relays
      const relays = [
        "wss://relay.damus.io",
        "wss://nostr-pub.wellorder.net",
        "wss://nostr.rocks",
        "wss://relay.nostr.info",
        "wss://nos.lol",
        "wss://relay.nostr.win",
        "wss://nostr-relay.wlvs.space",
        "wss://nostr.bitcoiner.social",
        "wss://relay.nostr.ch",
        "wss://relay.snort.social"
      ];
      
      let connectedRelays = 0;
      let publishedToAtLeastOne = false;
      
      for (const relayUrl of relays) {
        const ws = new WebSocket(relayUrl);
        
        ws.on('open', () => {
          connectedRelays++;
          console.log(`Connected to ${relayUrl}`);
          
          // Publish the event
          const publishMessage = ['EVENT', signedEvent];
          ws.send(JSON.stringify(publishMessage));
        });
        
        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message[0] === 'OK' && message[1] === eventId && message[2]) {
            console.log(`Event published to ${relayUrl}: ${eventId}`);
            publishedToAtLeastOne = true;
            ws.close();
            
            // If we've published to at least one relay and all connections have been attempted
            if (publishedToAtLeastOne && connectedRelays === relays.length) {
              resolve(eventId);
            }
          }
        });
        
        ws.on('error', (error) => {
          console.error(`Error with ${relayUrl}:`, error.message);
          connectedRelays++;
          
          // If all connections have been attempted
          if (connectedRelays === relays.length && publishedToAtLeastOne) {
            resolve(eventId);
          } else if (connectedRelays === relays.length) {
            reject(new Error('Failed to publish to any relay'));
          }
        });
      }
      
      // Set a timeout in case relays don't respond
      setTimeout(() => {
        if (publishedToAtLeastOne) {
          resolve(eventId);
        } else {
          reject(new Error('Timeout waiting for relay responses'));
        }
      }, 10000);
      
    } catch (error) {
      reject(error);
    }
  });
}

// Export as CommonJS module
module.exports = postToNostr;
