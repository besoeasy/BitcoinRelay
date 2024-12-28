import { finalizeEvent, getPublicKey } from "nostr-tools/pure";
import { Relay } from "nostr-tools/relay";
import { useWebSocketImplementation } from "nostr-tools/pool";
import WebSocket from "ws";
import * as nip19 from "nostr-tools/nip19";

useWebSocketImplementation(WebSocket);

const relayarray = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://purplerelay.com",
  "wss://nostr21.com",
  "wss://strfry.iris.to",
];

export async function commitMsg(nsec, content) {
  try {
    const { type, data } = nip19.decode(nsec);

    const sk = data;

    const randomRelay =
      relayarray[Math.floor(Math.random() * relayarray.length)];

    const relay = await Relay.connect(randomRelay);

    const pk = getPublicKey(sk);

    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content,
    };

    const signedEvent = finalizeEvent(eventTemplate, sk);

    await relay.publish(signedEvent);

    console.log("              ");
    console.log("https://primal.net/p/" + pk);
    console.log("Relay:", randomRelay);
    console.log("              ");
    console.log(signedEvent);
    console.log("              ");

    await relay.close();
  } catch (error) {
    console.error("Error in bot execution:", error);
  }
}
