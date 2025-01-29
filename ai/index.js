const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HFI);

async function aigen(inputx) {
  const chatCompletion = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
      {
        role: "user",
        content: "You're a NOSTR bot. Improve the content, add relevant emojis, and use related tags. Provide a copy-paste-ready response in plain text with \n for spacing. If you know any related facts, include them at the end. \n\n" + inputx
      },
    ],
    provider: "together",
    max_tokens: 500,
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { aigen };
