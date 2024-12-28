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
  "wss://lightningrelay.com",
  "wss://nostr.wine",
  "wss://at.nostrworks.com",
  "wss://brb.io",
  "wss://btc.klendazu.com",
  "wss://knostr.neutrine.com",
  "wss://nostr-1.nbo.angani.co",
  "wss://nostr.bitcoiner.social",
  "wss://nostr.corebreach.com",
  "wss://nostr.d11n.net",
  "wss://nostr-dev.wellorder.net",
  "wss://nostr.easydns.ca",
  "wss://nostr.einundzwanzig.space",
  "wss://nostr.gruntwerk.org",
  "wss://nostr.middling.mydns.jp",
  "wss://nostr.namek.link",
  "wss://nostr.noones.com",
  "wss://nostr-pub.wellorder.net",
  "wss://nostr-relay.bitcoin.ninja",
  "wss://nostr-relay.derekross.me",
  "wss://nostr-relay.schnitzel.world",
  "wss://nostr.roundrockbitcoiners.com",
  "wss://nostr.sectiontwo.org",
  "wss://nostr.semisol.dev",
  "wss://nostr.slothy.win",
  "wss://nostr-verified.wellorder.net",
  "wss://nostr-verif.slothy.win",
  "wss://nostr.vulpem.com",
  "wss://relay.damus.io",
  "wss://relay.lexingtonbitcoin.org",
  "wss://relay.minds.com/nostr/v1/ws",
  "wss://relay.nostr.band",
  "wss://relay.nostrid.com",
  "wss://relay.nostr.nu",
  "wss://relay.ryzizub.com",
  "wss://relay.snort.social",
  "wss://relay.stoner.com",
  "wss://soloco.nl",
  "wss://atlas.nostr.land",
  "wss://bitcoiner.social",
  "wss://relay.nostrplebs.com",
  "wss://relay.nostrview.com",
  "wss://puravida.nostr.land",
  "wss://relay.minibolt.info",
  "wss://feeds.nostr.band/popular",
  "wss://purplepag.es",
  "wss://yabu.me",
  "wss://relay.bitcoinpark.com",
  "wss://relay.primal.net",
  "wss://relay.wellorder.net",
  "wss://relay2.nostrchat.io",
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
