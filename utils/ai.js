import Together from 'together-ai';
import { getBitcoinPrice } from '../modules/btc_price.js';

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error('TOGETHER_API_KEY environment variable is required');
}
const together = new Together({ apiKey });

/**
 * Generates a structured Twitter post using Together AI API.
 * @param {string} inputx - The input content to analyze.
 * @param {Object} [options] - Optional configuration.
 * @param {string} [options.model] - AI model to use.
 * @param {number|null} [options.maxTokens] - Max tokens for response.
 * @returns {Promise<{success: boolean, prompt: string|null, response: string|null, error?: string}>}
 */
async function aigen(inputx, options = {}) {
  if (!inputx || typeof inputx !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  const { model = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', maxTokens = null } = options;

  const { price, sat } = await getBitcoinPrice();

  const prompt = `Improve this post, and explain it in key points if possible \n\n  use 1 bitcoin = ${price} and display estimated value in USD whereever bitcoin is mentioned in a minimal way \n\n ${inputx} i need output in plaintext add relevent hashtags below it, alyways use #bitcoin & #crypto hashtag, add any links at the end of the post`;

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
      max_tokens: maxTokens,
    });

    return {
      success: true,
      prompt,
      response: response.choices[0]?.message?.content || null,
    };
  } catch (error) {
    return {
      success: false,
      prompt,
      response: null,
      error: error.message || 'Unknown error occurred',
    };
  }
}

export { aigen };