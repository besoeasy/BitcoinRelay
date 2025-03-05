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
Analyze the content provided above and create a comprehensive, structured report. Follow these instructions precisely.

For Your Information: The current price of 1 Bitcoin (BTC) is $${price} USD. Use this information as needed.

GUIDELINES:
- **Structure:** Organize the content into well-defined sections for clarity.
- **Title:** Start with a concise and informative title.
- **Content:** Use multiple lines and sections, incorporating tables, lists, and bullet points to improve readability.
- **Visuals:** Include any relevant images or links at the bottom of the report.
- **Hashtags:** Conclude with a section containing 3 to 8 relevant hashtags.
- **Bitcoin References:** Whenever Bitcoin is mentioned, include its current value in USD alongside it (e.g., Bitcoin ($${price} USD)).
- **Format:** Ensure the output is in plain text, with each section separated by two new lines. Avoid using special formatting.

END OF DIRECTIVE`



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
