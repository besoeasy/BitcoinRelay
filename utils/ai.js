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
Analyze the content provided above and transform it into an informative report. Follow the instructions below strictly.

GUIDELINES:
- **Structure:** Organize the content into clearly defined sections.
- **Title:** Begin with a concise title.
- **Content:** Divide the body into multiple lines and sections, using tables, lists, and bullet points to enhance readability.
- **Visuals:** Include a section for Images/Links if available.
- **Hashtags:** Append a section with 3 to 8 relevant hashtags.
- **Bitcoin Information:** Wherever Bitcoin is mentioned, insert the note: "For Your Information: 1 BTC is priced at $${price} USD."
- **Format:** Output must be in plain text with each section separated by two new lines; no special formatting is allowed.

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
