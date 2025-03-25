import Together from 'together-ai';
import { getBitcoinPrice } from '../modules/btc_price.js';

const DEFAULT_DIRECTIVE = `
DIRECTIVE:
create a structured post from content given above Follow these guidelines:

GUIDELINES:
- **Content:** Use tables, lists, and bullet points. Include examples if relevant.
- **Hashtags:** Include 4-10 relevant hashtags, always include #crypto #bitcoin #news
- **Format:** Plain text, sections separated by two new lines.
- **Tone:** Professional, informative, and engaging.
- **Links:** Include 1-2 relevant links, always include a link to the source
- **Length:** 400 characters or less.

END OF DIRECTIVE`;

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

  const prompt = `${inputx}\n use 1 bitcoin = ${price} for all calculations \n\n${DEFAULT_DIRECTIVE}`;

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