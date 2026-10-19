/**
 * RasaLore AI - Local Ollama API Client
 * Manages communication with local Ollama daemon (http://localhost:11434).
 */

export class OllamaClient {
  /**
   * @param {object} [config={}]
   * @param {string} [config.baseUrl='http://localhost:11434']
   * @param {string} [config.modelName='gemma2:2b']
   * @param {number} [config.timeoutMs=15000]
   */
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.modelName = config.modelName || 'gemma2:2b';
    this.timeoutMs = config.timeoutMs || 15000;
  }

  /**
   * Probes Ollama health endpoint to check daemon availability and detect CORS issues.
   * @param {number} [timeoutMs=3000]
   * @returns {Promise<{ isAvailable: boolean, message: string, isCorsError?: boolean, models?: string[] }>}
   */
  async checkHealth(timeoutMs = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          isAvailable: false,
          isCorsError: false,
          message: `Ollama returned HTTP status ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const models = Array.isArray(data?.models) ? data.models.map(m => m.name) : [];
      const hasTargetModel = models.some(m => m.includes('gemma2') || m.includes('gemma'));

      return {
        isAvailable: true,
        message: hasTargetModel
          ? `Connected (Local Ollama: ${this.modelName})`
          : `Connected (Local Ollama ready, model ${this.modelName} recommended)`,
        models
      };
    } catch (err) {
      clearTimeout(timeoutId);

      // In browser fetch, CORS blockage or connection refused throws TypeError: Failed to fetch
      const isAbort = err.name === 'AbortError';
      const isTypeError = err instanceof TypeError || (err.message && err.message.includes('fetch'));

      return {
        isAvailable: false,
        isCorsError: isTypeError && !isAbort,
        message: isAbort
          ? `Ollama health probe timed out after ${timeoutMs}ms`
          : `Ollama unreachable or CORS blocked at ${this.baseUrl}`
      };
    }
  }

  /**
   * Dispatches generation prompt to Ollama's /api/generate endpoint.
   * @param {string} prompt - Prompt string.
   * @param {object} [options={}]
   * @param {number} [options.temperature=0.2]
   * @param {number} [options.top_p=0.95]
   * @returns {Promise<{
   *   text: string,
   *   promptTokens: number,
   *   completionTokens: number,
   *   totalTokens: number,
   *   totalDurationMs?: number
   * }>}
   */
  async generate(prompt, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: options.temperature ?? 0.2,
            top_p: options.top_p ?? 0.95
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.response || '';
      const promptTokens = data.prompt_eval_count || 0;
      const completionTokens = data.eval_count || 0;
      const totalTokens = promptTokens + completionTokens;
      const totalDurationMs = data.total_duration ? Math.round(data.total_duration / 1e6) : undefined;

      return {
        text,
        promptTokens,
        completionTokens,
        totalTokens,
        totalDurationMs
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }
}
