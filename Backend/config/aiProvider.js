const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

const PROVIDER_DEFAULTS = Object.freeze({
  openai: Object.freeze({
    apiKeyName: 'OPENAI_API_KEY',
    baseURL: undefined,
    chatModel: 'gpt-4o-mini',
    embeddingModel: 'text-embedding-3-small',
  }),
  gemini: Object.freeze({
    apiKeyName: 'GEMINI_API_KEY',
    baseURL: GEMINI_BASE_URL,
    chatModel: 'gemini-3.5-flash-lite',
    embeddingModel: 'gemini-embedding-001',
  }),
});

const getAiProviderConfig = (environment = process.env) => {
  const provider = (environment.AI_PROVIDER || 'openai').trim().toLowerCase();
  const defaults = PROVIDER_DEFAULTS[provider];
  if (!defaults) throw new Error(`Unsupported AI_PROVIDER "${provider}". Use "openai" or "gemini".`);

  const prefix = provider.toUpperCase();
  const apiKey = environment[defaults.apiKeyName]?.trim();
  return {
    provider,
    apiKey,
    apiKeyName: defaults.apiKeyName,
    baseURL: defaults.baseURL,
    configured: Boolean(apiKey),
    chatModel: environment[`${prefix}_CHAT_MODEL`]?.trim() || defaults.chatModel,
    embeddingModel: environment[`${prefix}_EMBEDDING_MODEL`]?.trim() || defaults.embeddingModel,
  };
};

const getAiProviderMetadata = (environment = process.env) => {
  const { apiKey: _apiKey, apiKeyName: _apiKeyName, baseURL: _baseURL, ...metadata } = getAiProviderConfig(environment);
  return metadata;
};

const getEmbeddingIdentity = (environment = process.env) => {
  const { provider, embeddingModel } = getAiProviderMetadata(environment);
  return { embeddingProvider: provider, embeddingModel };
};

module.exports = {
  GEMINI_BASE_URL,
  getAiProviderConfig,
  getAiProviderMetadata,
  getEmbeddingIdentity,
};
