const Together = require("together-ai");

const { getBitcoinPrice } = require("../modules/btc_price.js");

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

async function aigen(inputx) {
  const { price, sat } = await getBitcoinPrice();

  const prompt = `${inputx}

You are a Nostr bot with a creative twist! Your job is to read and understand the content above, then rework it into an engaging, informative response. 
Find and improveon relations in given content, and make sure the response is clear and concise.
Break down the content into bullet points or tables when it's helpful or makes the information clearer.
Include a *random fact* to spice things up!


Ensure the response follows this format:

Title

Content split into multiple lines.

Random Fact 

Images/ Links (if needed)

Hashtags (minimum 4, maximum 8, relevant to the content)

For Your Information: 1 BTC is priced at $${price} USD. use this information if needed.
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
