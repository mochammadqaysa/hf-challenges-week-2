/**
 * RasaLore AI - Hugging Face Serverless Client
 * Manages remote serverless fallback for Google Gemma 2 2B (google/gemma-2-2b-it).
 */

export class HfClient {
  /**
   * @param {object} [config={}]
   * @param {string} [config.endpoint='https://api-inference.huggingface.co/models/google/gemma-2-2b-it']
   * @param {number} [config.timeoutMs=15000]
   */
  constructor(config = {}) {
    this.endpoint = config.endpoint || 'https://api-inference.huggingface.co/models/google/gemma-2-2b-it';
    this.timeoutMs = config.timeoutMs || 15000;
  }

  /**
   * Generates text via Hugging Face Serverless Inference API.
   * @param {string} prompt - Prompt string.
   * @param {string} hfToken - User Access Token from Hugging Face.
   * @param {object} [options={}]
   * @param {number} [options.maxTokens=1024]
   * @param {number} [options.temperature=0.2]
   * @returns {Promise<{
   *   text: string,
   *   promptTokens: number,
   *   completionTokens: number,
   *   totalTokens: number
   * }>}
   */
  async generate(prompt, hfToken, options = {}) {
    if (!hfToken || typeof hfToken !== 'string' || !hfToken.trim()) {
      throw new Error('HF_TOKEN_MISSING: Hugging Face user access token required for remote serverless fallback');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: options.maxTokens ?? 1024,
            temperature: options.temperature ?? 0.2,
            return_full_text: false
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('HF_TOKEN_INVALID: Invalid or unauthorized Hugging Face token.');
        }
        if (response.status === 503) {
          throw new Error('HF_MODEL_LOADING: Gemma 2 model is currently cold-starting on Hugging Face. Please retry shortly.');
        }
        const errorBody = await response.text().catch(() => '');
        throw new Error(`HF HTTP Error ${response.status}: ${errorBody || response.statusText}`);
      }

      const data = await response.json();

      let text = '';
      if (Array.isArray(data) && data.length > 0) {
        text = data[0].generated_text || '';
      } else if (data && typeof data === 'object') {
        text = data.generated_text || data.text || '';
        if (data.error) {
          throw new Error(`HF Inference Error: ${data.error}`);
        }
      }

      // Conservative token estimation for serverless API
      const promptTokens = Math.max(1, Math.round(prompt.length / 4));
      const completionTokens = Math.max(1, Math.round(text.length / 4));
      const totalTokens = promptTokens + completionTokens;

      return {
        text,
        promptTokens,
        completionTokens,
        totalTokens
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Hugging Face serverless request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }
}
