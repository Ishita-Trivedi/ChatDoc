const test = require('node:test');
const assert = require('node:assert/strict');
const { __testables } = require('../services/aiService');

test('provider config preserves OpenAI defaults', () => {
  const config = __testables.getProviderConfig({ OPENAI_API_KEY: 'test-openai-key' });
  assert.equal(config.provider, 'openai');
  assert.equal(config.apiKey, 'test-openai-key');
  assert.equal(config.apiKeyName, 'OPENAI_API_KEY');
  assert.equal(config.baseURL, undefined);
  assert.equal(config.chatModel, 'gpt-4o-mini');
  assert.equal(config.embeddingModel, 'text-embedding-3-small');
});

test('provider config selects Gemini endpoint and defaults', () => {
  const config = __testables.getProviderConfig({
    AI_PROVIDER: 'GeMiNi',
    GEMINI_API_KEY: 'test-gemini-key',
  });
  assert.equal(config.provider, 'gemini');
  assert.equal(config.apiKey, 'test-gemini-key');
  assert.equal(config.apiKeyName, 'GEMINI_API_KEY');
  assert.equal(config.baseURL, __testables.GEMINI_BASE_URL);
  assert.equal(config.chatModel, 'gemini-3.5-flash-lite');
  assert.equal(config.embeddingModel, 'gemini-embedding-001');
});

test('provider-specific model overrides are honored', () => {
  const openai = __testables.getProviderConfig({
    AI_PROVIDER: 'openai',
    OPENAI_CHAT_MODEL: 'custom-openai-chat',
    OPENAI_EMBEDDING_MODEL: 'custom-openai-embedding',
  });
  const gemini = __testables.getProviderConfig({
    AI_PROVIDER: 'gemini',
    GEMINI_CHAT_MODEL: 'custom-gemini-chat',
    GEMINI_EMBEDDING_MODEL: 'custom-gemini-embedding',
  });
  assert.equal(openai.chatModel, 'custom-openai-chat');
  assert.equal(openai.embeddingModel, 'custom-openai-embedding');
  assert.equal(gemini.chatModel, 'custom-gemini-chat');
  assert.equal(gemini.embeddingModel, 'custom-gemini-embedding');
});

test('unsupported providers fail with a clear configuration error', () => {
  assert.throws(
    () => __testables.getProviderConfig({ AI_PROVIDER: 'unknown-provider' }),
    /Unsupported AI_PROVIDER.*openai.*gemini/,
  );
});
