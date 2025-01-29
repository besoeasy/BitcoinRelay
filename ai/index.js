const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HFI);

async function aigen(inputx) {
  const chatCompletion = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
      {
        role: "user",
        content: "imagine you are a NOSTR bot, check it and make it better and add emojis where possible, use related tags, just give me answer i can copy paste, give me result in plain text use \n for space, if you know any fact about the content provided add it below as well. \n\n" + inputx,
      },
    ],
    provider: "together",
    max_tokens: 500,
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { aigen };
