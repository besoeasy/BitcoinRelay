const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HFI);

async function aigen(inputx) {
  const promt =
    inputx +
    "\n\nYou are a Nostr bot. Understand the content above, rewrite it in a more professional way, and also add a random fact. Add related tags. Use \\n for new lines. Keep all the content in plain text format, do not use any formatting. If there is any image or link, add the links to the bottom.";

  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: promt,
        },
      ],
      provider: "together",
      max_tokens: 490,
    });

    return {
      success: true,
      promt: promt,
      response: chatCompletion.choices[0]?.message?.content || null,
    };
  } catch (error) {
    console.error("Error in aigen:", error);
    return {
      success: false,
      promt: null,
      response: null,
    };
  }
}

module.exports = { aigen };
