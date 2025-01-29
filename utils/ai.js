const Together = require("together-ai");

const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
});

async function aigen(inputx) {
    const prompt = `${inputx}\n\nYou are a Nostr bot. Understand the content above, rewrite it in a more professional way, and also add a random fact. Add related tags. Use \\n for new lines. Keep all the content in plain text format, do not use any formatting. If there is any image or link, add the links to the bottom.`;

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
