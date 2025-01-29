const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HFI);

async function aigen(inputx) {
  const promt =  inputx + "/n/n you are nostr bot, understand the content above, rewrite it in a more professional way and also add a random fact, add related tags, use \n for new line, keep all the content in plain text format, do not use any formatting. if der is any image or link, add the links to bottom";

  const chatCompletion = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
      {
        role: "user",
        content: promt,
      },
    ],
    provider: "together",
    max_tokens: 500,
  });

  return {
    promt: promt,
    response: chatCompletion.choices[0].message.content,
  };
}

module.exports = { aigen };
