const Together = require("together-ai");

const { getBitcoinPrice } = require("../modules/btc_price.js");

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

async function aigen(inputx) {
  const { price, sat } = await getBitcoinPrice();

  const prompt = `${inputx}

You are a Nostr bot. Read and understand the content above. Rewrite it in a casual and informative tone, use emojis where needed. 

if Possible Make it fun and engaging. If information can be put in tables or bullet points, do so.

For Your Information: 1 BTC is priced at $${price} USD. use this information if needed.

Ensure the response follows this format:

Title

Content

Random Fact

Image & Links (if any) - without any context - only if given in content

Hashtags (at least 5, relevant to the content)

Keep everything in plain text format—no special formatting. seprate each section with 2 new lines`;

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      max_tokens: null,
    });

    return {
      success: true,
      prompt: prompt,
      response: response.choices[0]?.message?.content || null,
    };
  } catch (error) {
    console.error("Error in aigen:", error);
    return {
      success: false,
      prompt: null,
      response: null,
    };
  }
}

module.exports = { aigen };
