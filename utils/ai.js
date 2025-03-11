const Together = require("together-ai");

const { getBitcoinPrice } = require("../modules/btc_price.js");

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY || null,
});

async function aigen(inputx) {
  if (!process.env.TOGETHER_API_KEY) {
    return {
      success: false,
      prompt: null,
      response: inputx,
    };
  }

  const { price, sat } = await getBitcoinPrice();

  const prompt = `${inputx}

DIRECTIVE:
Analyze the content (min 50 words, max 100 words) and create a structured twitter post. Follow these guidelines:

For Your Information: 1 Bitcoin (BTC) is priced at $${price} USD.

GUIDELINES:
- **Content:** Use tables, lists, and bullet points. Include examples if relevant.
- **Visuals:** Add images/links at the bottom.
- **Hashtags:** Include 3-8 relevant hashtags.
- **Bitcoin References:** Use Bitcoin ($${price} USD) format.
- **Format:** Plain text, sections separated by two new lines.

END OF DIRECTIVE`;

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
